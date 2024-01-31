#!/usr/bin/env python
# coding: utf-8

# # APWP-online toolbox
#
# #### Written by Bram Vaes - January 2023

# ## Load packages
import numpy as np
import pandas as pd
import math
import time
from statistics import mean,median
from pmagpy import pmag,ipmag,pmagplotlib

# ## Get relevant functions
from auxiliary import (di2vgp,R_pole_space,P_pole_space,pseudo_DIs,get_resampled_sed_poles,get_pseudo_vgps,get_rotated_vgps,running_mean_APWP,get_reference_poles,
                get_pseudopoles)


def parsePaleoPoles(options, sendProgress):
    sendProgress({"title": "Pre processing paleopoles.."})

    df = pd.DataFrame(data=options['source'])

    N_poles = len(df)

    # if age uncertainties are not given, use ±2 Ma
    df.min_age.fillna((df.age-2.), inplace=True)
    df.max_age.fillna((df.age+2.), inplace=True)

    # get pole latitudes and longitude
    if 'mdec' in df:
        if len(df['mdec']) > 0:
            mean_DIs = [[df['mdec'][i],df['minc'][i]] for i in range(N_poles)]
            samp_locs = [[df['slat'][i],df['slon'][i]] for i in range(N_poles)]
            paleopoles = di2vgp(di_block=mean_DIs,samp_loc=samp_locs)

            # add to dataframe
            poles_df = pd.DataFrame(paleopoles,columns=['plon','plat'])
            df['plat'] = poles_df['plat']
            df['plon'] = poles_df['plon']


    if 'P95' in df.columns:
        df['A95'] = df['P95']
        df['name'] = df.apply(lambda x: 'pole_at_%1d_Ma' % x['age'], axis=1)


    df = df.astype({'N':'int'})


    return df.to_dict('records');

def getReferencePoles(options, sendProgress):
    sendProgress({"title": "Loading in reference poles.."})

    ref_type = options['ref_type']

    if ref_type == "gapwap":
        # TODO JP: change this based on version selection in options
        ref_filename = 'Global_APWP_DB_Vaes_et_al.xlsx'
        ref_df = pd.read_excel(ref_filename,skiprows=2,header=0,usecols='A:AB') # build dataframe from Excel input file

        # if K and A95 are unavailable, replace with estimated value from Cox (1970) formula
        ref_df.K.fillna(ref_df.K_est, inplace=True)
        ref_df.A95.fillna(ref_df.A95_est, inplace=True)

        # convert to northern hemisphere
        ref_df['plat'] = ref_df['plat'].apply(lambda x: x*-1)
        ref_df['plon'] = ref_df['plon'].apply(lambda x: x-180. % 360)

        ref_df = ref_df.astype({'N':'int'}) # ensure values for N are integers

        return ref_df.to_dict('records')

    elif ref_type == "custom":
        ref_df = pd.DataFrame(data=options['ref_source'])

        # if age uncertainties are not given, use ±2 Ma
        ref_df.min_age.fillna((ref_df.age-2.), inplace=True)
        ref_df.max_age.fillna((ref_df.age+2.), inplace=True)

        ref_df = ref_df.astype({'N':'int'}) # ensure values for N are integers

        return ref_df.to_dict('records')

    elif ref_type == "geopole":
        ref_pole = [0,90]
        return ref_pole

    elif ref_type == "refpole":
        ref_pole = [ref_plon, ref_plat]
        # B95 = ref_A95 # is stored as B95 but is simply 95% confidence region of reference pole

        return ref_pole
    else:
        print("!WARNING, int getReferencePoles: ref_type '" + ref_type + "' is not a valid ref_type")
        return None

def calcRPD(options, sendProgress):
    sendProgress({"title": "Calculating displacements.."})

    ref_type = options['ref_type']

    df = pd.DataFrame(data=options['paleopoles'])

    # ### Choose setting
    Nb = options['Nb'] #20
    ref_window = options['ref_window'] #10
    ref_loc_type = options['ref_loc_type'];

    if ref_loc_type == 'mean_loc':
        # get reference location from sampling locations
        locations = ipmag.make_di_block(df['slon'].tolist(),df['slat'].to_list())
        loc_princ = pmag.doprinc(locations)
        mean_loc = [loc_princ['dec'],loc_princ['inc']]

    # GET EULER ROTATION POLES
    Euler_poles_filename = options['Euler_poles']
    if ref_type == 'gapwap':
        EP_data = np.genfromtxt(Euler_poles_filename, skip_header=1, delimiter=',') # load csv file
    else:
        EP_data = []

    # APPLY ALGORITHM TO EACH DATASET
    B95s,Rs,RSs,drs,Ls,LSs,dls,age_errs = [],[],[],[],[],[],[],[]
    ref_poles_lon,ref_poles_lat,ref_lon,ref_lat = [],[],[],[]

    N_poles = len(df)
    sendProgress({"title": "Calculating displacements..", "content": "Calculated 0 of %s poles" % (N_poles)})

    for i in range(N_poles):
        # GET KEY PARAMETERS
        N_s,min_age_test,max_age_test = df['N'][i],df['min_age'][i],df['max_age'][i]
        PP_lon,PP_lat,PP_A95 = df['plon'][i],df['plat'][i],df['A95'][i]

        # MODIFY REFERENCE DATA WINDOW
        if (max_age_test-min_age_test) < ref_window:
            max_age_test = df['age'][i]+(ref_window/2.)
            min_age_test = df['age'][i]-(ref_window/2.)

        # GET REFERENCE LOCATION
        if ref_loc_type == 'one_ref_loc':
            ref_loc = options['ref_loc']
        elif ref_loc_type == 'mean_loc':
            ref_loc = mean_loc
        else:
            ref_loc = [df['slon'][i],df['slat'][i]]

        # ------
        if ref_type == 'gapwap' or ref_type == 'custom':
            ref_df = pd.DataFrame(data=options['ref_poles'])

            # GET PSEUDOPOLES
            ppoles = []

            # SELECT PALEOPOLES FROM REFERENCE DATABASE
            df_ref_poles = ref_df[(ref_df.min_age <= max_age_test) & (ref_df.max_age >= min_age_test)].copy()
            df_ref_poles.reset_index()

            # GET PSEUDOPOLES
            ppoles = [get_pseudopoles(df=df_ref_poles,age_min=min_age_test,age_max=max_age_test,N_s=N_s,EP_data=EP_data) for k in range(Nb)]

            # COMPUTE REFERENCE MEAN
            ppoles_mean = pmag.fisher_mean(ppoles) # compute mean of pseudopoles
            ref_pole = [ppoles_mean['dec'],ppoles_mean['inc']] # store reference mean

            # COMPUTE ANGULAR DISTANCE OF PSEUDOPOLES TO REFERENCE MEAN
            D_ppoles=[]
            for j in range(Nb):
                ang_distance=pmag.angle(ppoles[j],ref_pole)
                D_ppoles.append(ang_distance[0])

            # COMPUTE STATISTICS
            D_ppoles.sort()
            ind_95perc=int(0.95*Nb)-1
            B95 = D_ppoles[ind_95perc]

        elif ref_type == 'geopole' or ref_type == 'refpole':
            ref_pole = options['ref_poles']
            ppoles_mean = {'dec': ref_pole[0], 'inc': ref_pole[1]}
            B95 = 0

        # ---------------
        # COMPUTE R AND P

        # compute rotation in pole-space
        R,dr = R_pole_space(ref_pole,B95,[PP_lon,PP_lat],PP_A95,ref_loc)

        if R-dr>0 or R+dr<0: # check if lower confidence limit of rotation is larger than zero
            RS = True
        else:
            RS = False


        # compute latitudinal displacement in pole-space
        plat_ref_pole = 90 - pmag.angle(ref_pole,ref_loc)[0]
        plat_obs_pole = 90 - pmag.angle([PP_lon,PP_lat],ref_loc)[0]

        if 'EI_unc_plat' in df:
            if df['EI_unc_plat'][i]>0:
                PP_A95 = df['EI_unc_plat'][i]

        P,dp = P_pole_space(ref_pole,B95,[PP_lon,PP_lat],PP_A95,ref_loc)
        L = P*-1
        dl = dp

        if P-dp>0 or P+dp<0: # check if lower confidence limit of rotation is larger than zero
            LS = True
        else:
            LS = False

        # Append values to lists
        B95s.append(B95)
        Rs.append(R)
        RSs.append(RS)
        drs.append(dr)
        Ls.append(L)
        LSs.append(LS)
        dls.append(dl)
        age_errs.append(df['max_age'][i]-df['age'][i])
        ref_poles_lon.append(ppoles_mean['dec'])
        ref_poles_lat.append(ppoles_mean['inc'])
        ref_lon.append(ref_loc[0])
        ref_lat.append(ref_loc[1])

        sendProgress({"title": "Calculating displacements..", "content": "Calculated %s of %s poles" % (i+1, N_poles)})

    # In[7]:
    temp_df = df[['name', 'age', 'min_age', 'max_age', 'N', 'plon','plat','A95']].copy()
    results = pd.DataFrame(
        list(zip(ref_poles_lon,ref_poles_lat,ref_lon,ref_lat,B95s,Rs,RSs,drs,Ls,LSs,dls)),
        columns=['ref_plon','ref_plat','ref_lon','ref_lat','B95','R','R_sig','delta_R','L','L_sig','delta_L']
    )
    output_df = pd.concat([temp_df,results],axis=1)
    return output_df.to_dict('records');

def calcAPWP(options, sendProgress):
    sendProgress({"title": "Calculating Custom APWP.."})

    df = pd.DataFrame(data=options['paleopoles'])

    # SETTINGS
    window_length = options['window_length'] #2
    time_step = options['time_step'] #1
    t_min = options['t_min'] #5
    t_max = options['t_max'] #25

    Nb = options['Nb'] #20

    # ------
    # get data
    df_range = df[(df.min_age <= t_max+window_length/2.) & (df.max_age >= t_min-window_length/2.)].copy()

    df_APWP = pd.DataFrame(columns=['age','run','N','A95','plon','plat','kappa','csd','mean_age'])
    EP_data=[]


    # ## Generate reference poles

    # COMPUTE REFERENCE POLES FOR EACH TIME STEP
    # Nb IS NUMBER OF ITERATIONS

    for i in range(Nb):
        output_df = get_reference_poles(df_range, df_APWP, window_length, time_step, t_min, t_max, EP_data)
        output_df['run'] = i
        df_APWP = df_APWP.append(output_df, ignore_index=True)
        sendProgress({"title": "Calculating Custom APWP..", "content": "On iteration %s of %s" % (i+1, Nb)})


    # ## Compute custom APWP
    # define center ages of time windows
    mean_pole_ages = np.arange(t_min, t_max + time_step, time_step)

    # define dataframe
    APWP = pd.DataFrame(columns=['center_age','min_age','max_age','N','P95','plon','plat','mean_K','mean_csd','mean_E','elong','age'])

    # compute APWP
    for center_age in mean_pole_ages:
        ref_poles = df_APWP.loc[df_APWP['age'] == center_age]
        ref_plons,ref_plats = ref_poles['plon'].tolist(),ref_poles['plat'].tolist()

        if (len(ref_plons) > 0) and (len(ref_plats) > 0):
            mean = ipmag.fisher_mean(dec=ref_plons, inc=ref_plats)

            if mean:
                # Compute angular distances of pseudopoles to reference pole
                D_ppoles=[]

                for j in range(len(ref_plons)):
                    ang_distance = pmag.angle([ref_plons[j],ref_plats[j]],[mean['dec'], mean['inc']])
                    D_ppoles.append(ang_distance[0])

                # Determine age range
                min_age = center_age - window_length/2.
                max_age = center_age + window_length/2.

                # Compute P95
                D_ppoles.sort()
                ind_95perc=int(0.95*len(ref_plons))
                P95 = D_ppoles[ind_95perc]

                # Compute parameters
                mean_N_VGPs = ref_poles['N'].mean()
                mean_K_VGPs = ref_poles['kappa'].mean()
                mean_csd_VGPs = ref_poles['csd'].mean()
                mean_E_VGPs = ref_poles['E'].mean()
                mean_age = ref_poles['mean_age'].mean()

                # Compute elongation of reference poles
                refpole_block = ipmag.make_di_block(ref_plons,ref_plats,unit_vector=False)
                ppars = pmag.doprinc(refpole_block)
                E = ppars["tau2"] / ppars["tau3"]

                # Add reference pole and metadata to dataframe
                APWP.loc[center_age] = [center_age, min_age, max_age, mean_N_VGPs, P95, mean['dec'], mean['inc'],mean_K_VGPs,mean_csd_VGPs,mean_E_VGPs,E,mean_age]

    APWP.reset_index(drop=1, inplace=True)
    return APWP.to_dict('records');

"""
CODE WITH ADAPTED FUNCTIONS FROM PMAGPY
"""

# ------------------------
# Import packages
import pmagpy.pmag as pmag
import pmagpy.ipmag as ipmag
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


# ------------------------
def di2vgp(di_block,slat=0,slon=0,samp_loc=0):
    """
    Converts directional data (declination, inclination) at a given sampling
    location (Site latitude, Site longitude) to pole position (pole longitude,
    pole latitude)

    Required Parameters
    -----------
    di_block : nested list of direction given as [declination,inclination]
    slat : sampling latitude
    slon : sampling longitude
    samp_loc : sampling location(s) given as nested list of [site LATITUDE, site LONGITUDE]

    Return
    -----------
    plat : latitude of VGP (or pole) associates with paleomagnetic direction assuming a GAD field
    plon : longitude of VGP (or pole) associates with paleomagnetic direction assuming a GAD field
    """
    # check number of directions
    n_dirs = len(di_block)

    # check if there are multiple sampling locations
    if samp_loc==0:

        input_list=[[di_block[k][0],di_block[k][1],0,slat,slon] for k in range(n_dirs)]
        output_list=pmag.dia_vgp(input_list)
        vgp_block=[[output_list[0][k],output_list[1][k]] for k in range(n_dirs)]

    else:
        n_locs = len(samp_loc)

        if n_dirs!=n_locs:
            print('ERROR: NUMBER OF LOCATIONS ARE NOT EQUAL TO NUMBER OF DIRECTIONS')
        else:
            input_list=[[di_block[k][0],di_block[k][1],0,samp_loc[k][0],samp_loc[k][1]] for k in range(n_dirs)]
            output_list=pmag.dia_vgp(input_list)
            vgp_block=[[output_list[0][k],output_list[1][k]] for k in range(n_dirs)]

    return vgp_block

def R_dir_space(ref_pole,ref_A95,obs_dir,obs_alpha95,local):
    """
    Compute rotation angle R with uncertainty dR using the direction-space approach of Ch.11 from Butler (1992)

    Required input:
    Reference pole -> [lon,lat]
    A95 of reference pole
    Observed grand mean direction -> [dec,inc]
    Alpha95 of observed direction
    Sampling locality [lon,lat]

    Output:
    R, dR
    """

    # compute expected direction from reference pole
    dec_r,inc_r=pmag.vgp_di(ref_pole[1],ref_pole[0],local[1],local[0])
    if dec_r > 180.:
        dec_r = dec_r - 360
    if obs_dir[0] > 180.:
        obs_dir[0] = obs_dir[0] - 360

    # compute rotation angle R in degrees (eq. A72)
    R = obs_dir[0] - dec_r

    # compute dDx and dDo (eq. A74 and A75)
    p_r = pmag.angle(ref_pole,local) # compute angular distance p_r between reference pole and sampling locality
    delta_Dr = np.rad2deg (np.arcsin(np.sin(np.deg2rad(ref_A95))/np.sin(np.deg2rad(p_r))))
    delta_Do = np.rad2deg (np.arcsin(np.sin(np.deg2rad(obs_alpha95))/np.cos(np.deg2rad(obs_dir[1]))))

    # compute delta_R
    delta_R = 0.8*np.sqrt(delta_Dr**2+delta_Do**2)

    return R, delta_R[0]

def R_pole_space(ref_pole,ref_A95,obs_pole,obs_A95,local):
    """
    Compute rotation angle R with uncertainty dR using the pole-space approach of Ch.11 from Butler (1992)

    Required input:
    Observed pole -> [lon,lat]
    A95 of observed pole
    Reference pole -> [lon,lat]
    A95 of reference pole
    Sampling locality [lon,lat]

    Output:
    R, dR
    """

    # compute expected direction from reference pole
    dec_r,inc_r = pmag.vgp_di(ref_pole[1],ref_pole[0],local[1],local[0])
    dec_o,inc_o = pmag.vgp_di(obs_pole[1],obs_pole[0],local[1],local[0])
    if dec_r > 180.:
        dec_r = dec_r - 360
    if dec_o > 180.:
        dec_o = dec_o - 360

    # compute rotation angle R in degrees (eq. A72)
    R = dec_o - dec_r

    # compute sides of spherical triangle
    p_r = pmag.angle(ref_pole,local) # compute angular distance p_r between reference pole and sampling locality
    p_o = pmag.angle(obs_pole,local) # compute angular distance p_o between observed pole and sampling locality
    s = pmag.angle(ref_pole,obs_pole) # compute angular distance s between observed pole and reference pole

    # compute dDx and dDo (eq. A74 and A75)
    delta_Dr = np.rad2deg (np.arcsin(np.sin(np.deg2rad(ref_A95))/np.sin(np.deg2rad(p_r))))
    delta_Do = np.rad2deg (np.arcsin(np.sin(np.deg2rad(obs_A95))/np.sin(np.deg2rad(p_o))))

    # compute delta_R
    delta_R = 0.8*np.sqrt(delta_Dr**2+delta_Do**2)

    # return results
    if ref_A95 > 0:
        return R, delta_R[0]
    else:
        #return R, delta_Do
        return R, delta_Do[0] ##Edited by JP 14-02-2023

def P_pole_space(ref_pole,ref_A95,obs_pole,obs_A95,local):
    """
    Compute poleward transport P with uncertainty dP using the pole-space approach of Ch.11 from Butler (1992)

    Required input:
    Observed pole -> [lon,lat]
    A95 of observed pole
    Reference pole -> [lon,lat]
    A95 of reference pole
    Sampling locality [lon,lat]

    Output:
    P, dP
    """

    p_r = pmag.angle(ref_pole,local) # compute angular distance p_r between reference pole and sampling locality
    p_o = pmag.angle(obs_pole,local) # compute angular distance p_o between observed pole and sampling locality

    # compute rotation angle R in degrees (eq. A72)
    P = p_o - p_r

    # compute dDx and dDo (eq. A74 and A75)
    delta_p_r = ref_A95
    delta_p_o = obs_A95

    # compute delta_R
    delta_P = 0.8*np.sqrt(delta_p_r**2+delta_p_o**2)

    if ref_A95 >0:
        return P[0], delta_P
    else:
        return P[0], obs_A95

def pseudo_DIs(DIs, random_seed=None, Nref=None):
    """
    Draw a bootstrap sample of directions returning as many bootstrapped samples
    as in the input directions
    Parameters
    ----------
    DIs : nested list of dec, inc lists (known as a di_block)
    random_seed : set random seed for reproducible number generation (default is None)
    Returns
    -------
    Bootstrap_directions : nested list of dec, inc lists that have been
    bootstrapped resampled
    """
    if random_seed != None:
        np.random.seed(random_seed)
    if Nref == None:
        sample_size = len(DIs)
    else:
        sample_size = Nref

    Inds = np.random.randint(len(DIs), size=sample_size)
    D = np.array(DIs)

    return D[Inds]

# ------------------------
def pt_rot(EP, Lats, Lons):
    """
    Rotates points on a globe by an Euler pole rotation using method of
    Cox and Hart 1986, box 7-3.
    Parameters
    ----------
    EP : Euler pole list [lat,lon,angle] specifying the location of the pole;
    the angle is for a counterclockwise rotation about the pole
    Lats : list of latitudes of points to be rotated
    Lons : list of longitudes of points to be rotated
    Returns
    _________
    RLats : list of rotated latitudes
    RLons : list of rotated longitudes
    """
# gets user input of Rotation pole lat,long, omega for plate and converts
# to radians
    E = pmag.dir2cart([EP[1], EP[0], 1.])  # EP is pole lat,lon omega
    omega = np.radians(EP[2])  # convert to radians
    RLats, RLons = [], []

    for k in range(len(Lats)):
        if Lats[k] <= 90.:  # peel off delimiters
            # converts to rotation pole to cartesian coordinates
            A = pmag.dir2cart([Lons[k], Lats[k], 1.])
# defines cartesian coordinates of the pole A
            R = [[0., 0., 0.], [0., 0., 0.], [0., 0., 0.]]
            R[0][0] = E[0] * E[0] * (1 - np.cos(omega)) + np.cos(omega)
            R[0][1] = E[0] * E[1] * (1 - np.cos(omega)) - E[2] * np.sin(omega)
            R[0][2] = E[0] * E[2] * (1 - np.cos(omega)) + E[1] * np.sin(omega)
            R[1][0] = E[1] * E[0] * (1 - np.cos(omega)) + E[2] * np.sin(omega)
            R[1][1] = E[1] * E[1] * (1 - np.cos(omega)) + np.cos(omega)
            R[1][2] = E[1] * E[2] * (1 - np.cos(omega)) - E[0] * np.sin(omega)
            R[2][0] = E[2] * E[0] * (1 - np.cos(omega)) - E[1] * np.sin(omega)
            R[2][1] = E[2] * E[1] * (1 - np.cos(omega)) + E[0] * np.sin(omega)
            R[2][2] = E[2] * E[2] * (1 - np.cos(omega)) + np.cos(omega)
# sets up rotation matrix
            Ap = [0, 0, 0]
            for i in range(3):
                for j in range(3):
                    Ap[i] += R[i][j] * A[j]
# does the rotation
            Prot = pmag.cart2dir(Ap)
            RLats.append(Prot[1])
            RLons.append(Prot[0])
        else:  # preserve delimiters
            RLats.append(Lats[k])
            RLons.append(Lons[k])

    if len(Lats)==1:
        return RLons[0],RLats[0]
    else:
        return RLons, RLats

#----------------------------------

def fish_VGPs(K=20, n=100, lon=0, lat=90):
    """
    Generates Fisher distributed unit vectors from a specified distribution
    using the pmag.py fshdev and dodirot functions.
    Parameters
    ----------
    k : kappa precision parameter (default is 20)
    n : number of vectors to determine (default is 100)
    lon : mean longitude of distribution (default is 0)
    lat : mean latitude of distribution (default is 90)
    di_block : this function returns a nested list of [lon,lat] as the default
    if di_block = False it will return a list of lon and a list of lat
    Returns
    ---------
    di_block : a nested list of [lon,lat] (default)
    lon,lat : a list of lon and a list of lat (if di_block = False)
    """

    k = np.array(K)
    R1 = np.random.random(size=n)
    R2 = np.random.random(size=n)
    L = np.exp(-2 * k)
    a = R1 * (1 - L) + L
    fac = np.sqrt(-np.log(a)/(2 * k))
    inc = 90. - np.degrees(2 * np.arcsin(fac))
    dec = np.degrees(2 * np.pi * R2)

    DipDir, Dip = np.ones(n, dtype=float).transpose(
    )*(lon-180.), np.ones(n, dtype=float).transpose()*(90.-lat)
    data = np.array([dec, inc, DipDir, Dip]).transpose()
    drot, irot = pmag.dotilt_V(data)
    drot = (drot-180.) % 360.  #
    VGPs = np.column_stack((drot, irot))
    # rot_data = np.column_stack((drot, irot))
    # VGPs = rot_data.tolist()

    # for data in range(n):
    #     lo, la = pmag.fshdev(K)
    #     drot, irot = pmag.dodirot(lo, la, lon, lat)
    #     VGPs.append([drot, irot])
    return VGPs

def get_pseudo_vgps(plons,plats,Ks,Ns,plate_IDs,age,min_age,max_age,sim_age=True):
    """
    Generates pseudopole from reference dataset of paleopoles with N and K
    """
    N_poles = len(plons)

    # generate nested list of parametrically sampled VGPs
    vgps_nested_list = [fish_VGPs(K=Ks[j],n=Ns[j],lon=plons[j],lat=plats[j]) for j in range(N_poles)]
    vgps_list = [vgps_nested_list[i][j] for i in range(N_poles) for j in range(Ns[i])]

    # create dataframe
    pseudo_VGPs = pd.DataFrame(vgps_list,columns=['plon','plat'])

    # generate and add plate IDs to dataframe
    plate_id_nested_list = [[plate_IDs[i]]*Ns[i] for i in range(N_poles)]
    plate_id_list = [plate_id_nested_list[i][j] for i in range(N_poles) for j in range(Ns[i])]
    pseudo_VGPs['plate_id'] = plate_id_list

    # generate and add simulated ages
    if sim_age == True:
      ages_nested_list = [np.random.uniform(low=min_age[i],high=max_age[i],size=Ns[i]) for i in range(N_poles)]
      ages_list = [ages_nested_list[i][j] for i in range(N_poles) for j in range(Ns[i])]
      pseudo_VGPs['age'] = ages_list

    return pseudo_VGPs

def rotate_with_ep(plon,plat,age,plate_ID,EP_data,output_type):
  """
  Rotate pole/VGP of with specified age and plate ID with Euler pole listed in .csv file

  Input:
  plon, plat: pole longitude and latitude
  age: age of pole/VGP
  plate_ID: plate number (e.g., 101 for North America)
  EP_data: multidimensional numpy array with columns plate ID, age, Euler pole latitude, Euler pole longitude, Euler pole angle

  Output:
  If output_type='rvgps': longitude and latitude of rotate pole/VGP
  If different output_type: latitude, longitude and angle of Euler pole
  """

  # round age to nearest integer
  rounded_age = round(age)

  # find index of Euler pole with correct plate ID and age (rounded to nearest integer value)
  indx = np.where((EP_data[:,0] == plate_ID) & (EP_data[:,1] == rounded_age))

  # rotate pole with Euler pole
  rlon,rlat = pt_rot([EP_data[indx,2][0][0], EP_data[indx,3][0][0],EP_data[indx,4][0][0]],[plat],[plon])

  # specify output
  if output_type == 'rvgps':
    return rlon,rlat
  else:
    return EP_data[indx,2][0][0], EP_data[indx,3][0][0], EP_data[indx,4][0][0]


def get_rotated_vgps(plons,plats,ages,plate_IDs,EP_data,output_type='rvgps'):
  """
  Rotate collection of poles/VGPs with Euler poles listed in file

  Input:
  plons, plats: pole/VGP longitudes and latitudes
  ages: ages of pole/VGP
  plate_IDs: plate numbers (e.g., 101 for North America)
  EP_data: multidimensional numpy array with columns plate ID, age, Euler pole latitude, Euler pole longitude, Euler pole angle

  Output:
  If output_type='EPs': dataframe with latitude, longitude and angle of Euler poles
  If different output_type: nested list of rotated poles/VGPs
  """

  # get rotated VGPs or Euler poles
  output_list = [rotate_with_ep(plons[i],plats[i],ages[i],plate_IDs[i],EP_data,output_type=output_type) for i in range(len(ages))]

  # create dataframe
  if output_type == 'EPs':
    EPs = pd.DataFrame(output_list,columns=['EP_lon','EP_lat','EP_ang'])
    return EPs

  else:
    return output_list

def sedimentary_pole_resample(PP_lon = 90, PP_lat = 45, a95 = 2, slon = 0, slat = 0, p_std = 1, plot = False):
    """
    Generates a pseudopole with a paleomagnetic colatitude sampled from a normal distribution with given standard deviation.

    Parameters
    ----------
    PP_lon : paleopole longitude
    PP_lat : paleopole latitude
    slon : longitude of sampling locationn
    slat : latitude of sampling location
    p_std : standard deviation of normal distribution of paleomagnetic colatitudes

    Returns
    ---------
    plon, plat: pseudopole longitude and latitude
    """

    # determine colatitude of paleopole
    p_ref = pmag.angle([PP_lon,PP_lat],[slon,slat])

    # resample colatitude from normal distribution
    p = np.random.normal(p_ref, p_std)

    # compute paleomagnetic direction
    dec, inc = pmag.vgp_di(PP_lat,PP_lon,slat,slon)

    # convert values to radians
    rad = np.pi / 180.
    p, dec, slat, slon = p * rad, dec * rad, slat * rad, slon * rad

    # determine latitude and longitude of pseudopole
    plat = np.arcsin(np.sin(slat) * np.cos(p) + np.cos(slat) * np.sin(p) * np.cos(dec)) # compute pole latitude
    beta = np.arcsin((np.sin(p) * np.sin(dec)) / np.cos(plat)) # compute beta angle
    if np.cos(p) > np.sin(slat) * np.sin(plat):
      plong = slon + beta
    else:
      plong = slon + np.pi - beta

    # determine paleopole position
    plat = np.rad2deg(plat)
    plong = np.rad2deg(plong)

    # plot (optional)
    if plot == True:
      m = ipmag.make_orthographic_map(180,60, land_color='linen',add_ocean=True,ocean_color='azure')
      ipmag.plot_pole(m, plong, plat, a95, color='red', edgecolor=None, markersize=20, filled_pole=False, fill_alpha=0.1, outline=False, label='Pseudopole')
      ipmag.plot_pole(m, PP_lon,PP_lat, a95, color='k', edgecolor=None, markersize=20, filled_pole=False, fill_alpha=0.1, outline=False, label='Original paleopole')
      plt.legend(loc=1)
      plt.show()

    return plong, plat

def get_resampled_sed_poles(dataframe):
    """
    Generates resampled sedimentary paleopoles using the standard deviation of an assumed Gaussian distribution of paleomagnetic colatitudes obtained from the E/I correction.

    Parameters
    ----------
    dataframe: dataframe with input data

    Returns
    ---------
    new_dataframe: dataframe with resampled sedimentary paleopoles (plon and plat)
    """
    new_dataframe = dataframe.copy()

    for index, row in new_dataframe.iterrows(): # iterate over rows of dataframe
        if row.lithology == 'sedimentary':
            # resample paleopole position
            p_std = row.p_std if row.p_std>0 else 2.
            #p_std = 3.
            new_plon, new_plat = sedimentary_pole_resample(PP_lon = row.plon, PP_lat = row.plat, slon = row.slon, slat = row.slat, p_std = p_std, plot = False)
            # replace value in updated dataframe
            new_dataframe['plon'][index], new_dataframe['plat'][index] = new_plon[0],new_plat[0]

    return new_dataframe

def running_mean_APWP (data, plon_label, plat_label, age_label, window_length, time_step, max_age, min_age, elong=False):
    """
    Generates a running mean apparent polar wander path from a collection of poles
    
    Required input:
    data: Pandas dataframe with pole longitude, latitude and age (in Ma)
    plon_label, plat_label, age_label: column names of pole longitude, pole latitude and age
    window_length: size of time window (in Ma)
    time_step: time step at which APWP is computed (in Ma)
    min_age, max_age: age interval for which APWP is computed (in Ma)
    
    Output:
    Pandas dataframe with APWP and associated statistical parameters
    """
    
    mean_pole_ages = np.arange(min_age, max_age + time_step, time_step)
    
    if elong == True:
        running_means = pd.DataFrame(columns=['age','N','A95','plon','plat','kappa','csd','E','mean_age'])
    else:
        running_means = pd.DataFrame(columns=['age','N','A95','plon','plat','kappa','csd','mean_age'])
    
    for age in mean_pole_ages:
        window_min = age - (window_length / 2.)
        if age == 0:
          window_max = 5
        else:
          window_max = age + (window_length / 2.)
        # store poles (or VGPs) that fall within time window
        poles = data.loc[(data[age_label] >= window_min) & (data[age_label] <= window_max)]
        plons,plats = poles[plon_label].tolist(),poles[plat_label].tolist()
        
        if (len(plons) > 0) and (len(plats) > 0):
            # compute Fisher (1953) mean
            mean = ipmag.fisher_mean(dec=plons, inc=plats)
            mean_age = poles.age.mean() # compute mean age
        
            if 'n' in mean and 'alpha95' in mean and 'k' in mean and 'csd' in mean: # this just ensures that dict isn't empty
                if elong == True:
                    # compute elongation
                    pole_block = ipmag.make_di_block(plons,plats,unit_vector=False)
                    ppars = pmag.doprinc(pole_block)
                    E = ppars["tau2"] / ppars["tau3"]
                    
                    running_means.loc[age] = [age, mean['n'], mean['alpha95'], mean['dec'], mean['inc'], mean['k'], mean['csd'], E, mean_age]
                else:
                    running_means.loc[age] = [age, mean['n'], mean['alpha95'], mean['dec'], mean['inc'], mean['k'], mean['csd'], mean_age]
    #         else:
    #             print('No pseudo-VGPs in age bin from %1.1f to %1.1f Ma' % (window_min,window_max))
    
    running_means.reset_index(drop=1, inplace=True)
    
    return running_means

def get_reference_poles (input_df,output_df,window_length, time_step, min_age, max_age, EP_data=[]):
    """
    Generates references poles of APWP

    Required input:
    input_df: Dataframe with paleopole compilation

    Output:
    Pandas dataframe with APWP and associated statistical parameters
    """
    # RE-SAMPLE SEDIMENTARY POLES
    df_iter = get_resampled_sed_poles(input_df)

    # GET PSEUDO VGPS
    pseudo_vgps = get_pseudo_vgps(df_iter['plon'].values,df_iter['plat'].values,df_iter['K'].values,df_iter['N'].values,df_iter['plateID'].values,df_iter['age'].values,df_iter['min_age'].values,df_iter['max_age'].values)

    if EP_data == []:
        df_vgps = pseudo_vgps.copy()

        # compute single iteration of bootstrap APWP
        APWP_iter = running_mean_APWP(df_vgps, 'plon', 'plat', 'age', window_length, time_step, max_age, min_age, elong=True)

    else:

        # ROTATE VGPs
        rVGPs = get_rotated_vgps(pseudo_vgps['plon'].values,pseudo_vgps['plat'].values,pseudo_vgps['age'].values,pseudo_vgps['plate_id'].values,EP_data,output_type='rvgps')
        df_rvgps = pd.DataFrame(rVGPs, columns = ['rlon', 'rlat'])

        # combines dataframe
        df_vgps = pd.concat([pseudo_vgps,df_rvgps],axis=1)

        # compute single iteration of bootstrap APWP
        APWP_iter = running_mean_APWP(df_vgps, 'rlon', 'rlat', 'age', window_length, time_step, max_age, min_age, elong=True)

    return APWP_iter

def get_pseudopoles (df,age_min,age_max,N_s,EP_data=[]):

    # RE-SAMPLE SEDIMENTARY POLES
    df_iter = get_resampled_sed_poles(df)

    # GET PSEUDO VGPS
    pseudo_vgps = get_pseudo_vgps(df_iter['plon'].values,df_iter['plat'].values,df_iter['K'].values,df_iter['N'].values,df_iter['plateID'].values,df_iter['age'].values,df_iter['min_age'].values,df_iter['max_age'].values)

    selec_vgps = pseudo_vgps.loc[(pseudo_vgps['age'] >= age_min) & (pseudo_vgps['age'] < age_max)]
    selec_vgps.reset_index(drop=True,inplace=True)

    if EP_data == []:
        df_vgps = selec_vgps.copy()
        df_vgps['rlon'] = df_vgps['plon'].copy()
        df_vgps['rlat'] = df_vgps['plat'].copy()
    else:
        # ROTATE VGPs
        rVGPs = get_rotated_vgps(selec_vgps['plon'].values,selec_vgps['plat'].values,selec_vgps['age'].values,selec_vgps['plate_id'].values,EP_data,output_type='rvgps')
        df_rvgps = pd.DataFrame(rVGPs, columns = ['rlon', 'rlat'])

        # combines dataframe
        df_vgps = pd.concat([selec_vgps,df_rvgps],axis=1)

    if N_s == 'all':
        pseudopole = ipmag.fisher_mean(dec=df_vgps['rlon'].tolist(), inc=df_vgps['rlat'].tolist())
    else:
#         if len(df_vgps) < N_s:
#             print('N_ref < N_studied')

        # randomly sample N pseudo-VGPs

        equal_n_vgps = df_vgps.sample(n = N_s, replace = True)

        pseudopole = ipmag.fisher_mean(dec=equal_n_vgps['rlon'].tolist(), inc=equal_n_vgps['rlat'].tolist())

    return [pseudopole['dec'],pseudopole['inc']]

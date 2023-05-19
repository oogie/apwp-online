import Demo_data_NEJ from "./assets/NEJ.csv";
import Demo_data_SWJ from "./assets/SWJ.csv";


export const config = {

    version: {
        apwp: "1.0"
    },


    demodata: [
        {"name":"DEMO - North east Japan","status":"created","error":null,"raw":{"name":"NEJ.csv","size":3163,"file":Demo_data_NEJ},"data":{"poles":[{"name":"NEJ-Baba-RY","age":16.52,"min_age":15.7,"max_age":17.34,"slat":38,"slon":140.7,"N":99,"K":34.1,"A95":2.5,"plat":68.5,"plon":56.4,"mdec":332.8,"minc":56.4,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Baba-TA","age":14.44,"min_age":13.56,"max_age":15.32,"slat":38,"slon":140.7,"N":93,"K":16.6,"A95":3.7,"plat":73.5,"plon":331.9,"mdec":356.6,"minc":38.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hir-Fuk1","age":22.3,"min_age":21.6,"max_age":23,"slat":37.3,"slon":140.6,"N":4,"K":90.3,"A95":9.7,"plat":77.7,"plon":36.2,"mdec":345.7,"minc":52.8,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hir-Nii1","age":12.9,"min_age":12.2,"max_age":13.6,"slat":37.8,"slon":138.8,"N":6,"K":132.2,"A95":5.8,"plat":82.3,"plon":272.6,"mdec":6.6,"minc":51.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hir-NMS","age":15,"min_age":14.5,"max_age":15.5,"slat":37.5,"slon":139.1,"N":28,"K":221.3,"A95":1.8,"plat":66.9,"plon":31.2,"mdec":335.1,"minc":46.4,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hoshi98-KE","age":17.1,"min_age":16.8,"max_age":17.4,"slat":40.18,"slon":141.31,"N":8,"K":105.9,"A95":5.4,"plat":88.9,"plon":217.2,"mdec":1.4,"minc":59.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hoshi98-NIS","age":21,"min_age":20.7,"max_age":21.3,"slat":40.28,"slon":141.33,"N":40,"K":41.6,"A95":3.5,"plat":34,"plon":54.2,"mdec":295.8,"minc":40.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hoshi97-Mot","age":18,"min_age":17.6,"max_age":18.4,"slat":36.6,"slon":140.2,"N":25,"K":72.8,"A95":3.4,"plat":82.7,"plon":318.1,"mdec":0.3,"minc":48.3,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hoshi97-Yam","age":17.2,"min_age":16.8,"max_age":17.6,"slat":36.6,"slon":140.2,"N":33,"K":21.6,"A95":5.5,"plat":81,"plon":235.1,"mdec":11,"minc":54.8,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hoshi13","age":15.9,"min_age":15.7,"max_age":16.1,"slat":36.57,"slon":140.19,"N":106,"K":32.9,"A95":2.4,"plat":82.7,"plon":200.8,"mdec":8.3,"minc":59.1,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hoshi07","age":13.5,"min_age":13.3,"max_age":13.7,"slat":38.75,"slon":141.2,"N":82,"K":42.8,"A95":2.4,"plat":77.5,"plon":178.4,"mdec":11.3,"minc":65.9,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hos-Im","age":16.1,"min_age":15,"max_age":17.2,"slat":39.28,"slon":140.84,"N":51,"K":58.9,"A95":2.6,"plat":65,"plon":83.1,"mdec":327.4,"minc":66.1,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Hos-Kr","age":14.5,"min_age":14,"max_age":15,"slat":39.29,"slon":140.78,"N":19,"K":128.7,"A95":3,"plat":82.1,"plon":236.9,"mdec":10,"minc":57.4,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto85-Dai","age":20.1,"min_age":19,"max_age":21.2,"slat":39.96,"slon":139.76,"N":17,"K":90.3,"A95":3.8,"plat":59.8,"plon":34,"mdec":327.2,"minc":45.3,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto85-Mas","age":21.9,"min_age":null,"max_age":null,"slat":39.18,"slon":140.33,"N":25,"K":137.2,"A95":2.5,"plat":56.7,"plon":106.5,"mdec":319.6,"minc":75,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto85-Oku","age":14.1,"min_age":null,"max_age":null,"slat":39.72,"slon":140.39,"N":18,"K":40.8,"A95":5.5,"plat":78.7,"plon":11.6,"mdec":349.6,"minc":51.5,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto85-Yun","age":33,"min_age":null,"max_age":null,"slat":39.12,"slon":140.37,"N":28,"K":29.3,"A95":5.1,"plat":57.7,"plon":76.5,"mdec":316.6,"minc":64,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto-Oka","age":25,"min_age":null,"max_age":null,"slat":39.03,"slon":140.36,"N":4,"K":133.9,"A95":8,"plat":52.1,"plon":49.9,"mdec":315.1,"minc":48.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto94-Its","age":6.3,"min_age":5.6,"max_age":7,"slat":40.02,"slon":141.11,"N":24,"K":156.6,"A95":2.4,"plat":80.5,"plon":353,"mdec":354.1,"minc":51.1,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto94-Kir","age":11.6,"min_age":10.4,"max_age":12.8,"slat":40,"slon":140.94,"N":24,"K":57.4,"A95":3.9,"plat":74.5,"plon":300.9,"mdec":5.8,"minc":43.4,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto94-Nis","age":21.8,"min_age":null,"max_age":null,"slat":40.3,"slon":141.34,"N":22,"K":35,"A95":5.3,"plat":22.5,"plon":66.2,"mdec":278.8,"minc":43.5,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto94-Yas","age":17.2,"min_age":16.3,"max_age":18.1,"slat":39.23,"slon":140.21,"N":34,"K":46.5,"A95":3.6,"plat":50.6,"plon":67.9,"mdec":308.3,"minc":58.9,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto-Azu","age":7.15,"min_age":7,"max_age":7.3,"slat":40.13,"slon":140.86,"N":4,"K":21.4,"A95":20.3,"plat":82.6,"plon":192.6,"mdec":8.2,"minc":63,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto97-mean1","age":13.75,"min_age":12,"max_age":15.5,"slat":36.8,"slon":139.3,"N":8,"K":29.9,"A95":10.3,"plat":81,"plon":310.2,"mdec":1.6,"minc":46.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Oto97-mean2","age":7.95,"min_age":5,"max_age":10.9,"slat":36.8,"slon":139.3,"N":21,"K":13.1,"A95":9.1,"plat":79,"plon":267,"mdec":10,"minc":48.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Tak-RY","age":16,"min_age":15.5,"max_age":16.5,"slat":37.75,"slon":140.75,"N":63,"K":31.1,"A95":3.3,"plat":86,"plon":351.5,"mdec":357.5,"minc":53.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Tak-TM","age":20,"min_age":19.5,"max_age":20.5,"slat":37.75,"slon":140.82,"N":31,"K":16,"A95":6.7,"plat":51.5,"plon":33.2,"mdec":321.1,"minc":35,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Tam-Og/Ts","age":16,"min_age":15.5,"max_age":16.5,"slat":38.9,"slon":139.6,"N":19,"K":24,"A95":7,"plat":84.2,"plon":305.4,"mdec":1.7,"minc":52.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Yam-Kan","age":17.8,"min_age":16.2,"max_age":19.4,"slat":37.72,"slon":139.47,"N":11,"K":26.1,"A95":9.1,"plat":79.1,"plon":54.7,"mdec":346.2,"minc":57.3,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"NEJ-Yam-Kit","age":22.7,"min_age":22.4,"max_age":23,"slat":38.25,"slon":139.67,"N":9,"K":8.8,"A95":18.4,"plat":68.2,"plon":70.3,"mdec":331.8,"minc":61.5,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"WHO-Fuj-As","age":9.25,"min_age":7.3,"max_age":11.2,"slat":42,"slon":140.5,"N":19,"K":18.9,"A95":7.9,"plat":76.7,"plon":319.7,"mdec":0.2,"minc":47.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"WHO-Fuj-Fu","age":23,"min_age":21.7,"max_age":24.3,"slat":42,"slon":140.5,"N":13,"K":26.1,"A95":8.3,"plat":38,"plon":59.4,"mdec":295.8,"minc":49.3,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"WHO-Fuj-Kik","age":12.85,"min_age":11.2,"max_age":14.5,"slat":42,"slon":140.5,"N":10,"K":15.9,"A95":12.5,"plat":84.9,"plon":329.5,"mdec":359,"minc":56.4,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"WHO-Fuj-Ku","age":15.8,"min_age":14.5,"max_age":17.1,"slat":42,"slon":140.5,"N":29,"K":8.9,"A95":9.5,"plat":78.7,"plon":24.8,"mdec":347.3,"minc":55.8,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"WHO-Oto-Kun","age":24.7,"min_age":23.5,"max_age":25.9,"slat":43,"slon":140.9,"N":19,"K":22.9,"A95":7.2,"plat":44.7,"plon":83.2,"mdec":293,"minc":66.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"WHO-Tan-Fur","age":13.81,"min_age":11.63,"max_age":15.99,"slat":43.2,"slon":140.5,"N":19,"K":37,"A95":5.6,"plat":84.1,"plon":212.9,"mdec":7.9,"minc":63.2,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"WHO-Tan-Yob","age":3.96,"min_age":2.58,"max_age":5.33,"slat":43.2,"slon":140.5,"N":6,"K":32.5,"A95":11.9,"plat":73.3,"plon":296.1,"mdec":7.7,"minc":46.4,"plateID":null,"lithology":"undefined","f":null,"p_std":null}],"length":37},"calculations":[]},
        {"name":"DEMO - South west Japan","status":"created","error":null,"raw":{"name":"SWJ.csv","size":3215,"file":Demo_data_SWJ},"data":{"poles":[{"name":"SWJ-Hay86-Ake","age":17.8,"min_age":17.5,"max_age":18.1,"slat":35.4,"slon":137.2,"N":20,"K":13.8,"A95":9.1,"plat":42.9,"plon":221,"mdec":55,"minc":45.9,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hay86-Oid","age":15.75,"min_age":15.7,"max_age":15.8,"slat":35.4,"slon":137.2,"N":12,"K":17.5,"A95":10.7,"plat":66.8,"plon":244.2,"mdec":24.8,"minc":44.3,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hay86-Toy","age":17.5,"min_age":16,"max_age":19,"slat":34.7,"slon":136.9,"N":29,"K":19.8,"A95":6.2,"plat":43.4,"plon":210.8,"mdec":57.2,"minc":53.3,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hay86-Uts","age":15.5,"min_age":15,"max_age":16,"slat":34.7,"slon":136.9,"N":45,"K":15.1,"A95":5.7,"plat":63.8,"plon":215.7,"mdec":32.2,"minc":55,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hay84-Ich","age":16.4,"min_age":15.2,"max_age":17.6,"slat":34.7,"slon":136.4,"N":39,"K":10.1,"A95":7.6,"plat":50.4,"plon":230.8,"mdec":43.9,"minc":41,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hir99-Ake","age":17.8,"min_age":17.5,"max_age":18.1,"slat":35.4,"slon":137.2,"N":78,"K":19.7,"A95":3.7,"plat":46.4,"plon":224.4,"mdec":50.3,"minc":45,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hir99-Mat","age":16.6,"min_age":15.7,"max_age":17.5,"slat":34.82,"slon":138,"N":98,"K":11.3,"A95":4.5,"plat":53.1,"plon":186.9,"mdec":46.4,"minc":68.2,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hir-INS","age":16.3,"min_age":15.6,"max_age":17,"slat":36.25,"slon":136.3,"N":62,"K":120.7,"A95":1.6,"plat":55.8,"plon":225.6,"mdec":40.3,"minc":48.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hoshi13-Tsu","age":15,"min_age":14.7,"max_age":15.3,"slat":35.2,"slon":137.62,"N":9,"K":15.9,"A95":13.3,"plat":79.6,"plon":263.6,"mdec":9.6,"minc":47.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hoshi01-Shi","age":15,"min_age":14.3,"max_age":15.7,"slat":35.15,"slon":137.61,"N":21,"K":29.8,"A95":5.9,"plat":84,"plon":254.8,"mdec":6.3,"minc":51.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hoshi00-Nijo","age":14.9,"min_age":14.6,"max_age":15.2,"slat":34.5,"slon":135.6,"N":20,"K":26.2,"A95":6.5,"plat":85,"plon":50,"mdec":353.9,"minc":54.2,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Hoshi15-Oid","age":15.75,"min_age":15.7,"max_age":15.8,"slat":35.4,"slon":137.25,"N":19,"K":18.6,"A95":8,"plat":77.2,"plon":262.3,"mdec":11.8,"minc":46.1,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Ishi-KK","age":30,"min_age":27,"max_age":33,"slat":33.9,"slon":130.7,"N":45,"K":34.6,"A95":3.7,"plat":56.4,"plon":224.1,"mdec":37.9,"minc":44.2,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Itoh-EMio","age":15.7,"min_age":15,"max_age":16.4,"slat":36,"slon":137.2,"N":5,"K":30.3,"A95":14.1,"plat":79,"plon":240.3,"mdec":12.8,"minc":52.2,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Itoh-Hig","age":15,"min_age":14.9,"max_age":15.1,"slat":36.6,"slon":137.08,"N":61,"K":17.7,"A95":4.4,"plat":83,"plon":317.1,"mdec":360,"minc":48.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Itoh-Ton","age":14.8,"min_age":14.7,"max_age":14.9,"slat":36.6,"slon":137.08,"N":7,"K":145,"A95":5,"plat":89,"plon":223.8,"mdec":1.3,"minc":56.1,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Itoh-Dai","age":15.9,"min_age":15.2,"max_age":16.6,"slat":36.25,"slon":136.33,"N":56,"K":61.8,"A95":2.4,"plat":60.1,"plon":217.1,"mdec":37.1,"minc":54.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Itoh-Kan","age":15.9,"min_age":15.2,"max_age":16.6,"slat":36.5,"slon":136.67,"N":5,"K":25.7,"A95":15.4,"plat":68.8,"plon":226.8,"mdec":25.7,"minc":53.1,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Itoh03-Ioz","age":15.6,"min_age":15.2,"max_age":16,"slat":36.55,"slon":136.83,"N":7,"K":11.9,"A95":18.2,"plat":65.2,"plon":225.2,"mdec":30.1,"minc":52.8,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Itoh01-Was","age":21,"min_age":20,"max_age":22,"slat":36.28,"slon":136.61,"N":5,"K":31.2,"A95":13.9,"plat":50.5,"plon":209.9,"mdec":49.9,"minc":56.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Koj-Kori","age":19,"min_age":17,"max_age":21,"slat":36.25,"slon":133.2,"N":4,"K":13.9,"A95":25.6,"plat":41.7,"plon":221.1,"mdec":55.1,"minc":42.4,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Koj-Oki","age":6.8,"min_age":6.6,"max_age":7,"slat":36.3,"slon":133.23,"N":4,"K":13.8,"A95":25.6,"plat":78.3,"plon":332.7,"mdec":355.7,"minc":43.2,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Nak-Kun","age":12.6,"min_age":11.1,"max_age":14.1,"slat":36.1,"slon":136.1,"N":6,"K":33.4,"A95":11.8,"plat":74.5,"plon":337.4,"mdec":354,"minc":38.2,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Nak-Nun","age":16,"min_age":14.2,"max_age":17.8,"slat":36.1,"slon":136.1,"N":3,"K":15.7,"A95":32.3,"plat":60.5,"plon":257,"mdec":26.4,"minc":32.9,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Nak-Sas","age":19,"min_age":18.6,"max_age":19.4,"slat":36.1,"slon":136.1,"N":7,"K":6.8,"A95":25,"plat":54.8,"plon":220,"mdec":42.5,"minc":51.4,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Nak-Uch","age":15.1,"min_age":14.8,"max_age":15.4,"slat":35.5,"slon":135.5,"N":4,"K":12,"A95":27.7,"plat":79.5,"plon":20.2,"mdec":349,"minc":49.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Nak-Ume","age":15.4,"min_age":13.4,"max_age":17.4,"slat":35.9,"slon":136,"N":23,"K":35.1,"A95":5.2,"plat":71.7,"plon":337.6,"mdec":353,"minc":34.1,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Oto83-Kaw","age":28.5,"min_age":28,"max_age":29,"slat":35,"slon":132.5,"N":6,"K":16.4,"A95":17,"plat":35.7,"plon":225.4,"mdec":58.3,"minc":32.2,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Oto83-KG","age":33,"min_age":32,"max_age":34,"slat":35,"slon":132.5,"N":5,"K":111.5,"A95":7.3,"plat":41.2,"plon":206.5,"mdec":59.8,"minc":52.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Oto84-31/35","age":33,"min_age":31,"max_age":35,"slat":34.85,"slon":132,"N":15,"K":13.1,"A95":11,"plat":33.4,"plon":211.8,"mdec":65.9,"minc":44.1,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Oto84-Hata","age":21,"min_age":20,"max_age":22,"slat":35.08,"slon":132.52,"N":4,"K":19.3,"A95":21.4,"plat":30.7,"plon":213.4,"mdec":68.2,"minc":41.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Oto91-Kaw","age":16.1,"min_age":14.7,"max_age":17.5,"slat":35.23,"slon":132.75,"N":5,"K":43.1,"A95":11.8,"plat":56.6,"plon":228.2,"mdec":37.6,"minc":44.3,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Oto91-Omo","age":14.2,"min_age":13.6,"max_age":14.8,"slat":35.28,"slon":132.92,"N":10,"K":13.1,"A95":13.9,"plat":87.3,"plon":62.6,"mdec":356.9,"minc":55.6,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Saw-Hata","age":15.9,"min_age":14.9,"max_age":16.9,"slat":35.18,"slon":132.73,"N":6,"K":51.2,"A95":9.5,"plat":78.6,"plon":278.4,"mdec":7.1,"minc":43.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Saw-Sada","age":20,"min_age":18,"max_age":22,"slat":35.18,"slon":132.73,"N":6,"K":28.2,"A95":12.8,"plat":44,"plon":220.3,"mdec":52.5,"minc":43.2,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Tam06-Ioz","age":17,"min_age":16.7,"max_age":17.3,"slat":36.56,"slon":137.07,"N":4,"K":18.5,"A95":22,"plat":51.3,"plon":229.8,"mdec":44.1,"minc":44.5,"plateID":null,"lithology":"undefined","f":null,"p_std":null},{"name":"SWJ-Tam06-Iwa","age":17.2,"min_age":16.8,"max_age":17.6,"slat":36.54,"slon":137.06,"N":5,"K":11.4,"A95":23.7,"plat":55.9,"plon":231.8,"mdec":38.9,"minc":45.7,"plateID":null,"lithology":"undefined","f":null,"p_std":null}],"length":37},"calculations":[]}
    ],


    datasetImportValidation: [
        // Format: defaultOpts = {
        //     field: "",
        //     type: "number",
        //     cond: ((v, rows) => true),
        //     condMsg: "",
        //     optional: false,
        // }

        //required fields
        { field: "age", cond: ((v) => v >= 0), condMsg: "positive" },
        { field: "slat", cond: ((v) => (v >= -90 && v <= 90)), condMsg: "between -90 and 90" },
        { field: "slon", cond: ((v) => (v >= -180 && v <= 360)), condMsg: "between -180 and 360" },
        { field: "N", cond: ((v) => v > 1), condMsg: "bigger then 1" },
        { field: "K", cond: ((v) => v >= 0), condMsg: "positive" },
        { field: "A95", cond: ((v) => v >= 0), condMsg: "positive" },

        //optional fields
        { field: "min_age", cond: ((v, row) => v < row['age']), condMsg: "less then the age", optional: true },
        { field: "max_age", cond: ((v, row) => v > row['age']), condMsg: "bigger then the age", optional: true },
        { field: "f", cond: ((v) => (v >= 0 && v <= 1)), condMsg: "between 0 and 1", optional: true },
        { field: "p_std", cond: ((v) => v >= 0), condMsg: "positive", optional: true },


        //check values of plat, plon, minc, mdec as optional fields
        { field: "plat", cond: ((v) => (v >= -90 && v <= 90)), condMsg: "between -90 and 90", optional: true },
        { field: "plon", cond: ((v) => (v >= -180 && v <= 360)), condMsg: "between -180 and 360", optional: true },
        { field: "minc", cond: ((v) => (v >= -90 && v <= 90)), condMsg: "between -90 and 90", optional: true },
        { field: "mdec", cond: ((v) => (v >= -180 && v <= 360)), condMsg: "between -180 and 360", optional: true },

        // if plat is set, plon must be set too and vice versa
        { field: "plat", cond: ((v, row) => (row['plon'] !== null && row['plon'] !== undefined)), condMsg: "paired with a plon value, plon is missing", optional: true },
        { field: "plon", cond: ((v, row) => (row['plat'] !== null && row['plat'] !== undefined)), condMsg: "paired with a plat value, plat is missing", optional: true },
        
        // if minc is set, mdec must be set too and vice versa
        { field: "minc", cond: ((v, row) => (row['mdec'] !== null && row['mdec'] !== undefined)), condMsg: "paired with a mdec value, mdec is missing", optional: true },
        { field: "mdec", cond: ((v, row) => (row['minc'] !== null && row['minc'] !== undefined)), condMsg: "paired with a minc value, minc is missing", optional: true },

        //if min_age is set, max_age must be set too and vice versa
        { field: "min_age", cond: ((v, row) => (row['max_age'] !== null && row['max_age'] !== undefined)), condMsg: "paired with a max_age value, max_age is missing", optional: true },
        { field: "max_age", cond: ((v, row) => (row['min_age'] !== null && row['min_age'] !== undefined)), condMsg: "paired with a min_age value, min_age is missing", optional: true },
    ],

}
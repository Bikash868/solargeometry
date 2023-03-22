import {
  days,
  days2,
  deg,
  rad,
  RADIUS,
  pi,
  error,
  lh,
  STD_LONG,
  daytab,
  name_mnts,
} from "./constants";

let month, day;
let alt, azm, srt=0, sra=0, hra=0;
let rads;
let start_ang, end_ang;
let x1, y1, x2, y2, dh1, dh2, r1, hr;
let i;
let Declination;
let Hemisphere, Latitude, Longitude;
//Adding util functions for calculteResult COMMON.C

let solarconstant;

function decl(n) {
  let i, j, k, low, high, code;
  let step = 7;
  let d = {};
  d[3] = d[344] = -22.83;
  d[10] = d[337] = -22;
  d[17] = d[330] = -20.83;
  d[24] = d[323] = -19.33;
  d[31] = d[316] = -17.5;
  d[38] = d[309] = -15.5;
  d[45] = d[302] = -13.25;
  d[52] = d[295] = -10.83;
  d[59] = d[288] = -8.25;
  d[66] = d[281] = -5.58;
  d[73] = d[274] = -2.83;
  d[80] = d[266] = 0; /*21st March and 23rd September*/
  d[87] = d[259] = 2.83;
  d[95] = d[251] = 5.92;
  d[102] = d[244] = 8.5;
  d[109] = d[237] = 11;
  d[116] = d[230] = 13.33;
  d[124] = d[222] = 15.75;
  d[131] = d[215] = 17.67;
  d[138] = d[208] = 19.42;
  d[145] = d[201] = 20.83;
  d[152] = d[194] = 21.92;
  d[159] = d[187] = 22.75;
  d[166] = d[180] = 23.25;
  d[173] = 23.45; /*22nd June*/
  d[361] = d[351] = -23.33;
  d[356] = -23.45;

  if (n === 1 || n === 2) code = 1;
  else if (n > 361 && n < 366) code = 2;
  else code = 3;

  // console.log("n code:", n, code);

  switch (code) {
    case 1:
      return (d[n] = d[3] + ((d[3] - d[361]) / 7) * n);

    case 2:
      return (d[n] = d[361] - ((d[361] - d[3]) / 7) * (n - 361));

    case 3:
      for (i = 0; i <= 13; i++) {
        if (n === lh[i] || n === lh[i + 1]) return d[n];
        else if (n > lh[i] && n < lh[i + 1]) {
          low = lh[i];
          high = lh[i + 1];
          // console.log("low high:", low, high);
          if (high - low <= 8) step = high - low;
          for (j = low; j <= high; j += step) {
            k = j + step;
            if (n === k) {
              // console.log("n==k d[n]:", d[n]);
              return d[n];
            } else if (n > j && n < k) {
              d[n] = d[k] - ((d[k] - d[j]) / step) * (k - n);
              // console.log("d[k] k n", d[k], k, n);
              // console.log("d[j] j", d[j], j);
              // console.log("line 80 d[n]", step);
              return d[n];
            }
          }
        }
      }
      break;
    default:
      return 0;
  }
  return d[n];
}

/*-----------Rise function----------*/
function rise(srt1, sra1) {
  srt = srt1;
  sra = sra1;
  // console.log("  in rise getting: srt=%f sra=%f\n",srt1,sra1);
  // console.log("  Declination Latitude:",Declination,Latitude);
  // console.log("  Hemisphere:",Hemisphere)
  let code, rtime=0, azm=0;
  rtime = Math.tan(Latitude) * Math.tan(Declination);
  if (rtime >= -1.0 && rtime <= 1.0) code = 1;
  if (rtime > 1.0) code = 2;
  if (rtime < -1.0) code = 3;

  switch (code) {
    case 1:
      rtime = Math.acos(-rtime);
      rtime = 12.0 - (rtime * rad) / 15.0;
      azm = Math.acos(Math.sin(Declination) / Math.cos(Latitude));
      break;

    case 2:
      if (Hemisphere.toUpperCase() === "N") {
        rtime = 0.0;
        rtime = 0.0;
      } else {
        rtime = 0.0;
        azm = pi;
      }
      break;

    case 3:
      rtime = -1.0;
      rtime = Math.acos(-rtime);
      rtime = 12.0 - (rtime * rad) / 15.0;
      if (Hemisphere.toUpperCase() === "S") azm = 0.0;
      else azm = pi;
      break;
    default:
      break;
  }
  // console.log("  in rise assigning: srt=%f sra=%f\n",rtime,azm);
  srt = rtime;
  sra = azm;
  return;
}

/*--------------Position Function----------*/
function position(hr, alt, azm) {
  let noon;
  let hra, azmt, altd;

  noon = Math.tan(Declination) / Math.tan(Latitude);
  hra = (12.0 - hr) * 15.0 * deg;
  /*Find AZM & ALT */
  altd = Math.asin(
    Math.sin(Latitude) * Math.sin(Declination) +
      Math.cos(Latitude) * Math.cos(Declination) * Math.cos(hra)
  );

  if (altd < 0.0) altd = 0.0;
  if (hr === 12.0)
    switch (Hemisphere.toUpperCase()) {
      case "N":
        azmt = noon < 1 ? pi : 0.0;
        break;
      case "S":
        azmt = noon < 1 ? 0.0 : pi;
        break;
      default:
        break;
    }
  else {
    azmt = Math.acos(
      (Math.cos(Latitude) * Math.sin(Declination) -
        Math.sin(Latitude) * Math.cos(Declination) * Math.cos(hra)) /
        Math.cos(altd)
    );
    if (hr > 12) azmt = 2 * pi - azmt;
  }

  azm = azmt;
  alt = altd;
  return;
}

/*-----------------Function to find Shadow Angles---------*/
function shdangle(wazm, alt, azm, hsa, vsa) {
  if (wazm > 270 && wazm < 360) {
    if (azm <= 0.5 * pi) hsa = wazm * deg - 2 * pi + azm;
    else hsa = wazm * deg - azm;
  } else if (wazm >= 0 && wazm < 90) {
    if (azm >= 1.5 * pi) hsa = wazm * deg + 2 * pi - azm;
    else hsa = wazm * deg - azm;
  } else hsa = wazm * deg - azm;

  if (hsa < pi / 2 - error && hsa > -pi / 2 + error)
    vsa = Math.atan(Math.tan(alt) / Math.cos(hsa));
  else vsa = 0;

  return;
}

/*---------Function to calculate radiation -----------*/
/*---------given day and alt -in W/SqM----------------*/
function radiation(day, alt) {
  let i;
  let airmass;
  let transfactor;
  let solconst = [
    [1, 32, 60, 91, 121, 152, 182, 213, 243, 274, 305, 335],
    [1399, 1392, 1378, 1354, 1331, 1316, 1309, 1313, 1328, 1352, 1375, 1392],
  ];
  if (day > 335) {
    solarconstant = 1392 + (7 * (day - 335)) / 30;
  } else {
    for (i = 0; i < 12; ++i) {
      if (day > solconst[0][i] && day < solconst[0][i + 1])
        solarconstant =
          solconst[1][i] +
          (solconst[1][i + 1] - solconst[1][i]) *
            ((day - solconst[0][i]) / (solconst[0][i + 1] - solconst[0][i]));
      else if (day == solconst[0][i]) solarconstant = solconst[1][i];
    }

    airmass = 1 / Math.sin(alt);
    transfactor = 0.921 / (1 + 0.3135 * airmass);
  }

  return solarconstant * transfactor;
}

function timecrt(yday, Istime) {
  let month, day;
  let Lmt, Latime;

  /*------convert yearday to month, day---------*/
  fnctmonday(yday, month, day);

  Lmt = (STD_LONG - Longitude) / 15;

  Lmt = Istime - Lmt;
  Latime = Lmt - Eq_of_time(day, month) / 60;
  return Latime;
}

function Eq_of_time(day, month) {
  let n, daygap, interval, index;
  let Eq_time = [
    [1.0, 6.0, 11.0, 16.0, 21.0, 26.0, 31.0],
    [3.233, 5.55, 7.683, 9.566, 11.166, 12.466, 13.433],
    [13.583, 14.15, 14.366, 14.266, 13.85, 13.183, 12.828],
    [12.65, 11.617, 10.4, 9.033, 7.567, 6.05, 4.533],
    [4.233, 2.75, 1.35, 0.05, -1.1, -2.067, -2.679],
    [-2.833, -3.367, -3.683, -3.767, -3.617, -3.233, -2.633],
    [-2.483, -1.683, -0.75, 0.283, 1.35, 2.433, 3.26],
    [3.467, 4.4, 5.183, 5.783, 6.183, 6.367, 6.3],
    [6.25, 5.883, 5.25, 4.383, 3.3, 2.017, 0.583],
    [0.283, -1.33, -3.05, -4.817, -6.583, -8.317, -9.649],
    [-9.983, -11.55, -12.967, -14.183, -15.167, -15.867, -16.267],
    [-16.317, -16.333, -16.017, -15.35, -14.317, -12.933, -11.6002],
    [-11.267, -9.317, -7.133, -4.783, -3.333, 0.167, 2.633],
  ];
  index =
    (month % 2 == 0 && month < 8 && day > 26) ||
    (month % 2 == 1 && month > 8 && day > 26);
  if (day % 5 === 1) {
    return Eq_time[month][day / 5];
  } else if (index && day === 30) {
    return Eq_time[month][6];
  } else {
    if (index && month !== 2) daygap = 4;
    else if (index && month === 2) daygap = 2;
    else daygap = 5;

    n = Math.ceil(day / 5);

    interval = (Eq_time[month][n + 1] - Eq_time[month][n]) / daygap;
    return Eq_time[month][n] + interval * (day - 5 * n - 1);
  }
}

/*---Function to find yearday given the month and day in number-----*/
function fnctyearday(month, day) {
  let i;
  for (i = 1; i < month; i++) day += daytab[i];
  return day;
}

function fnctmonday(yearday, pmonth, pday) {
  let i;
  for (i = 1; yearday > daytab[i]; i++) yearday -= daytab[i];
  pmonth = i;
  pday = yearday;
  return;
}

/*------Function to find month name given the index--*/
function month_name(index) {
  return name_mnts[index];
}

//THIS IS THE MAIN FUNCTION WHICH RETURNS THE RESULT
export const calculteResult = (
  latitude,
  latitudeHemisphere,
  longitude,
  longitudeHemisphere
) => {
  if (latitudeHemisphere.toUpperCase() === "S") latitude *= -1 * deg;
  else latitude *= deg;

  Hemisphere = latitudeHemisphere;
  Longitude = longitude;
  Latitude = latitude;

  //STARTING A FILE PTR FOR DRAWING THE GRAPH
  //   strcpy(cityfile, city);
  //   strcat(cityfile, ".dxf");
  //   fpt = fopen(cityfile, "w");
  //   fprintf(fpt, "  0");
  //   fprintf(fpt, "\nSECTION\n  2\nENTITIES");

  for (alt = -10; alt < 90; alt += 10) {
    if (alt < 0) {
      rads = RADIUS * 1.05;
    } else {
      rads = RADIUS * Math.tan((Math.PI / 2 - alt * deg) / 2.0);
    }

    // console.log("fpt","0");
    // console.log("fpt","CIRCLE  80 62     1 100.0 200.0 40");
    // console.log("fpt",rads.toFixed(2));

    if (alt > 0) {
      //   console.log("fpt","0");
      //   console.log("fpt","TEXT  80 100.0 20%.2f 404.0  1", rads);
      //   console.log("fpt",alt.toFixed(0));
    }
  }

  for (azm = 0; azm < 360; azm += 10) {
    x1 = RADIUS * Math.sin(azm * deg);
    y1 = RADIUS * Math.cos(azm * deg);

    x2 = RADIUS * 1.05 * Math.sin(azm * deg);
    y2 = RADIUS * 1.05 * Math.cos(azm * deg);

    // console.log("fpt","0");
    // console.log("fpt","LINE  80 10%.2f 20%.2f", x1, y1);
    // console.log("fpt"," 11%.2f 21%.2f", x2, y2);
    x1 = (RADIUS + 8) * Math.sin(azm * deg);
    y1 = (RADIUS + 8) * Math.cos(azm * deg);

    // console.log("fpt","0");
    // console.log("fpt","TEXT  80 10%.2f 20%.2f 404.0  1", x1, y1);
    // console.log("fpt","%.0f", azm);
    // console.log("fpt"," 50%.2f", 360 - azm);

    if (azm === 0) {
      //   console.log("fpt","0");
      //   console.log("fpt","TEXT  80 10%.2f 20%.2f 405.0  1", x1, y1 + 9);
      //   console.log("fpt","N");
    }
    if (azm === 180) {
      //   console.log("fpt","0");
      //   console.log("fpt","TEXT  80 10%.2f 20%.2f 405.0  1", x1, y1 - 15);
      //   console.log("fpt","S");
    }
  }

  //   console.log("fpt","0");
  //   console.log("fpt","LINE  80 10-1.0 200.0");
  //   console.log("fpt"," 111.0 210.0");

  //   console.log("fpt","0");
  //   console.log("fpt","LINE  80 100.0 201.0");
  //   console.log("fpt","110.0 21-1.0");

  /*-----------Text N/S symbols----------*/

  /*-------------Path for days-------------------*/

  for (i = 0; i < days.length; ++i) {
    Declination = decl(days[i]);
    // console.log("days[i] Declination", days[i], Declination);
    Declination *= deg;
    // console.log("passing: i srt, sra:", i, srt, sra)
    rise(srt, sra);
    // console.log("i srt, sra:", i, srt, sra)
    x1 = RADIUS * Math.sin(sra);
    y1 = RADIUS * Math.cos(sra);

    fnctmonday(days[i], month, day);

    if (Math.sin(Latitude) + Math.sin(Declination)) {
      rads =
        (RADIUS * Math.cos(Declination)) /
        (Math.sin(Latitude) + Math.sin(Declination));
      dh1 =
        (RADIUS * Math.cos(Latitude)) /
        (Math.sin(Latitude) + Math.sin(Declination));

      start_ang = Math.asin((Math.sin(sra) * RADIUS) / rads);
      start_ang *= rad;

      // fprintf(fpt,"\n0");
      // fprintf(fpt,"\nARC\n  8\n0\n 62\n     4\n 10\n0.0\n 20\n%.2f\n 40",dh1);
      // fprintf(fpt,"\n%.2f",Math.abs(rads));
      if (dh1 < 0) {
        // fprintf(fpt,"\n 50\n%.2f\n 51\n%.2f", 90+start_ang,90-start_ang);
      } else {
        // fprintf(fpt,"\n 50\n%.2f\n 51\n%.2f", 270-start_ang,270+start_ang)
      }

      end_ang = (180 * 20) / (pi * rads);
      end_ang = start_ang - end_ang;
      end_ang *= deg;

      x2 = Math.sin(end_ang) * rads;
      y2 = dh1 - Math.cos(end_ang) * rads;

      // fprintf(fpt,"\n0");
      // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n%.2f\n 20\n%.2f\n 40\n4.0\n  1",x2,y2+1);
      // fprintf(fpt, "\n%d %s", day, month_name(month));

      // fprintf(fpt,"\n 72\n     5\n 11\n%.2f\n 21\n%.2f", x1-2,y1+1);

      fnctmonday(days2[i], month, day);
      // fprintf(fpt,"\n0");
      // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n%.2f\n 20\n%.2f\n 40\n4.0\n  1",-x1+2,y1+1);
      // fprintf(fpt, "\n%d %s", day, month_name(month));
      // fprintf(fpt,"\n 72\n     5\n 11\n%.2f\n 21\n%.2f", -x2, y2+1);
    } else {
      // fprintf(fpt,"\n0");
      // fprintf(fpt,"\nLINE\n  8\n0\n 10\n%.2f\n 20\n%.2f", x1, y1);
      // fprintf(fpt,"\n 11\n%.2f\n 21\n%.2f",-x1,y1);

      // fprintf(fpt,"\n0");
      // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n%.2f\n 20\n%.2f\n 40\n4.0\n  1",x1-20,y1+1);
      // fprintf(fpt, "\n%d %s", day, month_name(month));
      // fprintf(fpt,"\n 72\n     5\n 11\n%.2f\n 21\n%.2f", x1-2,y1+1);

      fnctmonday(days2[i], month, day);
      // fprintf(fpt,"\n0");
      // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n%.2f\n 20\n%.2f\n 40\n4.0\n  1",-x1+2,y1+1);
      // fprintf(fpt, "\n%d %s", day, month_name(month));
      // fprintf(fpt,"\n 72\n     5\n 11\n%.2f\n 21\n%.2f", -x1+20, y1+1);
    }
  }

  /*---------Routine for hr_lines-----------*/
  console.log("hr dh1 dh2 y1 y2 rads start_ang end_ang");
  dh1 = RADIUS * Math.tan(latitude);

  for (hr = 6; hr < 12; ++hr) {
    hra = deg * (12 - hr) * 15;
    dh2 = RADIUS / (Math.cos(Latitude) * Math.tan(hra));
    rads = RADIUS / (Math.cos(Latitude) * Math.sin(hra));

    Declination = 23.45 * deg;
    position(hr, alt, azm);
    r1 = RADIUS * Math.tan((pi / 2 - alt) / 2);
    x1 = r1 * Math.sin(azm);
    y1 = r1 * Math.cos(azm);
    end_ang = Math.acos((x1 + dh2) / rads);

    Declination = -23.45 * deg;
    rise(srt, sra);
    if (srt <= 6) end_ang *= -1;

    if (hr > 6) {
      Declination = -23.45 * deg;
      position(hr, alt, azm);
      r1 = RADIUS * Math.tan((pi / 2 - alt) / 2);
      x2 = r1 * Math.sin(azm);
      x2 = Math.abs(x2);
      y2 = r1 * Math.cos(azm);
      y2 = Math.abs(y2);
      start_ang = Math.acos((dh2 + x2) / rads);
      if (y2 > dh1) start_ang *= -1;
    } else start_ang = Math.acos(RADIUS / rads);

    if (longitudeHemisphere.toUpperCase() == "S" && hr == 6) {
      Declination = -23.45 * deg;
      position(hr, alt, azm);
      r1 = RADIUS * Math.tan((pi / 2 - alt) / 2);
      x2 = r1 * Math.sin(azm);
      x2 = Math.abs(x2);
      y2 = r1 * Math.cos(azm);
      y2 = Math.abs(y2);
      start_ang = Math.acos((dh2 + x2) / rads);
      start_ang *= -1;
      if (y2 > Math.abs(dh1)) start_ang *= -1;
      end_ang = Math.acos(RADIUS / rads);
      end_ang *= -1;
      console.log("South Hemisphere: 6th Hour");
      console.log(
        dh1.toFixed(2),
        dh2.toFixed(2),
        y1.toFixed(2),
        y2.toFixed(2),
        rads.toFixed(2),
        (start_ang * rad).toFixed(2),
        (end_ang * rad).toFixed(2)
      );
    }

    start_ang *= rad;
    end_ang *= rad;

    console.log(
      hr.toFixed(2),
      dh1.toFixed(2),
      dh2.toFixed(2),
      y1.toFixed(2),
      y2.toFixed(2),
      rads.toFixed(2),
      start_ang.toFixed(2),
      end_ang.toFixed(2)
    );

    // fprintf(fpt,"\n0");
    // fprintf(fpt,"\nARC\n  8\n0\n 62\n     4\n 10\n%.2f\n 20\n%.2f\n 40",-dh2, -dh1);
    // fprintf(fpt,"\n%.2f",Math.abs(rads));
    // fprintf(fpt,"\n 50\n%.2f\n 51\n%.2f", start_ang,end_ang);

    // fprintf(fpt,"\n0");
    // fprintf(fpt,"\nARC\n  8\n0\n 62\n     4\n 10\n%.2f\n 20\n%.2f\n 40",dh2, -dh1);
    // fprintf(fpt,"\n%.2f",Math.abs(rads));
    // fprintf(fpt,"\n 50\n%.2f\n 51\n%.2f", 180-end_ang, 180-start_ang);

    // fprintf(fpt,"\n0");
    if (hr > 6) {
      // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n%.2f\n 20\n%.2f\n 40\n4.0\n  1",x1 -1, y1 +1);
    } else {
      // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n%.2f\n 20\n%.2f\n 40\n4.0\n  1",x1 -3, y1 + 9);
    }

    // fprintf(fpt,"\n%.0f",hr);
    // fprintf(fpt,"\n 50\n%.2f", end_ang);

    // fprintf(fpt,"\n0");
    if (hr > 6) {
      // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n%.2f\n 20\n%.2f\n 40\n4.0\n  1",-x1 +1, y1 + 1);
    } else {
      // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n%.2f\n 20\n%.2f\n 40\n4.0\n  1",-x1 +2, y1 + 9);
    }

    // fprintf(fpt,"\n%.0f",24 - hr);
    // fprintf(fpt,"\n 50\n%.2f", -end_ang);
  }

  /*-------Draw line for 12th hour---------*/
  Declination = 23.45 * deg;
  hr = 12.0;
  position(hr, alt, azm);
  y1 = RADIUS * Math.tan((pi / 2 - alt) / 2);
  if (azm > 0) {
    y1 *= -1;
  }

  Declination = -23.45 * deg;
  position(hr, alt, azm);
  y2 = RADIUS * Math.tan((pi / 2 - alt) / 2);
  if (azm > 0) {
    y2 *= -1;
  }

  // fprintf(fpt,"\n0");
  // fprintf(fpt,"\nLINE\n  8\n0\n 62\n     4\n 10\n0.0\n 20\n%.2f", y1);
  // fprintf(fpt,"\n 11\n0.0\n 21\n%.2f", y2);

  // fprintf(fpt,"\n0");
  // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n0.0\n 20\n%.2f\n 40\n4.0\n  1", y1 + 1);
  // fprintf(fpt,"\n12");

  // fprintf(fpt,"\n0");
  // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n-100\n 20\n135\n 40\n5.0\n  1");
  // fprintf(fpt,"\nSUNPATH DIAGRAM FOR %s ", strupr(city));
  // fprintf(fpt,"\n0");
  // fprintf(fpt,"\nTEXT\n  8\n0\n 10\n-100\n 20\n125\n 40\n5.0\n  1");
  // fprintf(fpt,"\nLatitude %.2f %c  Longitude %.2f %c",Latitude*rad, toupper(Hemisphere), Longitude, toupper(hem1));
  // fprintf(fpt,"\n0\nENDSEC\n0\nEOF");
  // fclose(fpt);

  //Return a json to display in the UI
  return {};
};

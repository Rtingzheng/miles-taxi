let timer,time=0,distance=0,money=80;
let running=false;
let watchID , startTime;
let prevLat = null , prevLon = null;
let nextDistanceStop = 0.1;
let nextTimeStep = 120;

function toRad(deg){
    return deg * Math.PI/180; 
}

function getDistanceFromLatLon(lat1,lon1,lat2,lon2){
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
     Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     return R * c;
}

function updateDisplay(){
    let timeText = "0:00.0";
    if(startTime){
    const now = new Date();
    const diff = (now - startTime)/1000;
    const minute = Math.floor(diff/60);
    const second = (diff % 60).toFixed(1);
    timeText = `${minute}:${second.padStart(4,0)}`;
    }

    document.getElementById("time").textContent = timeText;
    document.getElementById("distance").textContent = distance.toFixed(1);
    document.getElementById("money").textContent = money;
}

function start(){ 
    if (running) return;
    running = true;
    startTime = new Date();

    timer = setInterval(() => {
       const now = new Date();
       const diff = (now - startTime) / 1000;
    
        if (diff >=nextTimeStep){
            money +=5;
            nextTimeStep +=120;
        }
        updateDisplay();
    },100);
}

if (navigator.geolocation) {
    watchID = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        if (prevLat !== null && prevLon !== null) {
          const d = getDistanceFromLatLon(prevLat, prevLon, latitude, longitude);
          if (d > 0.005) { // 移動超過 3 公尺才算，過濾誤差
            distance += d;
            if (distance >= nextDistanceStep) {
              money += 5;
              nextDistanceStep += 0.1;
            }
            updateDisplay();
          }
        }

        prevLat = latitude;
        prevLon = longitude;
      },
      (err) => {
        console.error("GPS 錯誤：", err.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  } else {
    alert("你的裝置不支援 GPS");
  }


function pause(){
    running = false;
    clearInterval(timer);
    navigator.geolocation.clearWatch(watchID);
}

function reset(){
    pause();
    time = 0;
    distance=0;
    money=80;
    nextDistanceStep = 0.1;
    nextTimeStep = 120;
    prevLat = null;
    prevLon = null;
    startTime = null;
    updateDisplay();
}

updateDisplay();
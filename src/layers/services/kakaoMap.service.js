const kakaoMapRepository = require('../repositories/kakaoMap.repository.js');
const userRepository = require('../repositories/user.repository');

const updatePosition = async (userId, latitude, longitude) => {
    const positionData = await kakaoMapRepository.updatePosition(userId, latitude, longitude);
    return positionData;
};

const findAroundCatcher = async (userId, maxDist) => {
    const userPosition = await kakaoMapRepository.findUserPosition(userId);
    const latitude = userPosition.latitude;
    const longitude = userPosition.longitude;
    const authData = await kakaoMapRepository.findAroundCatcher();
    console.log(latitude, longitude);
    //오래 걸릴 수 있으니 고민이 필요함.
    let positionArr = [];
    for (let data of authData) {
        try {
            if (data.latitude == null) continue;

            if (distance(latitude, longitude, data.latitude, data.longitude) < maxDist) {
                const userData = await userRepository.getUserStatusByUserId(data.authId);
                const authData = await kakaoMapRepository.findUserPosition(data.authId);
                userData.latitude = authData.latitude;
                userData.longitude = authData.longitude;
                userData.imgUrl =
                    userData.imgUrl[0] === 'h'
                        ? userData.imgUrl
                        : process.env.S3_STORAGE_URL + `w280/` + userData.imgUrl.split('/')[1];
                // userData.imgUrl = process.env.S3_STORAGE_URL + `w280/` + userData.imgUrl.split('/')[1];
                positionArr.push(userData);
            }
        } catch (err) {
            console.log('에러남!' + err);
            continue;
        }
    }
    return { aroundUser: positionArr };
};

function distance(lat1, lon1, lat2, lon2, unit = 'K') {
    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    } else {
        console.log(lat1, lon1, lat2, lon2, unit);
        var radlat1 = (Math.PI * lat1) / 180;
        var radlat2 = (Math.PI * lat2) / 180;
        var theta = lon1 - lon2;
        var radtheta = (Math.PI * theta) / 180;
        var dist =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        //unit에 K가 들어오면 km를 반환해줌.
        if (unit == 'K') {
            dist = dist * 1.609344;
        }
        if (unit == 'N') {
            dist = dist * 0.8684;
        }
        return dist;
    }
}
module.exports = {
    updatePosition,
    findAroundCatcher
};

const firebase = require('firebase/app');
const { database, auth } = require('../config/Firebase');

// 회원가입
exports.signup = async (req, res) => {
  try {
    const { USER_NAME, USER_PW, USER_EMAIL, USER_ADD, USER_TEL } = req.body;

    // Firebase를 사용하여 회원가입을 처리합니다.
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(USER_EMAIL, USER_PW);
    const user = userCredential.user;

    // 프로필 설정 및 실시간 데이터베이스에 사용자 정보 저장
    await user.updateProfile({ displayName: USER_NAME });

    await database.ref('users/' + user.uid).set({
      USER_NAME,
      USER_PW,
      USER_EMAIL,
      USER_ADD,
      USER_TEL,
    });

    res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '회원가입에 실패했습니다. 다시 시도해주세요.' });
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { USER_EMAIL, USER_PW } = req.body;

    // Firebase를 사용하여 로그인을 처리합니다.
    const userCredential = await firebase.auth().signInWithEmailAndPassword(USER_EMAIL, USER_PW);
    const user = userCredential.user;

    // 실시간 데이터베이스에서 추가 사용자 정보를 가져옵니다.
    const userSnapshot = await database.ref('users/' + user.uid).once('value');
    const userInfo = userSnapshot.val();
    
    res.status(200).json({ user: userInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '로그인에 실패했습니다. 다시 시도해주세요.' });
  }
};

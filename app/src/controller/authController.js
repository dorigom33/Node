const { database } = require('../config/firebase');
const firebase = require('firebase/app');
require('firebase/auth');
// 회원가입
exports.signup = async (req, res) => {
  try {
    const { USER_NAME, USER_PW, USER_EMAIL, USER_ADD, USER_TEL } = req.body;

    // Firebase를 사용하여 회원가입을 처리합니다.
    const userCredential = await auth.createUserWithEmailAndPassword(USER_EMAIL, USER_PW);
    const user = userCredential.user;

    // 프로필 설정 및 실시간 데이터베이스에 사용자 정보 저장
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

    // 사용자 데이터베이스에서 사용자를 찾습니다.
    const userSnapshot = await database.ref('users').orderByChild('USER_EMAIL').equalTo(USER_EMAIL).once('value');
    if (userSnapshot.exists()) {
      const userObj = userSnapshot.val();
      const [uid] = Object.keys(userObj);
      const userInfo = userObj[uid];

      // 암호화된 비밀번호와 입력한 비밀번호를 비교합니다.
      if (USER_PW === userInfo.USER_PW) {
        req.session.userName = userInfo.USER_NAME; // 세션에 userName 추가
      } else {
        res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
      }
    } else {
      res.status(404).json({ message: '해당 이메일을 사용하는 사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '로그인에 실패했습니다. 다시 시도해주세요.' });
  }
};


exports.signupWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Firebase를 사용하여 Google 계정으로 회원가입을 처리합니다.
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider().credential(idToken);
    const userCredential = await firebase.auth().signInWithCredential(googleAuthProvider);
    const user = userCredential.user;

    // 프로필 설정 및 실시간 데이터베이스에 사용자 정보 저장
    await database.ref('users/' + user.uid).set({
      USER_NAME: user.displayName,
      USER_EMAIL: user.email,
    });

    res.status(201).json({ message: 'Google 회원가입이 성공적으로 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Google 회원가입에 실패했습니다. 다시 시도해주세요.' });
  }
};

exports.loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Firebase를 사용하여 Google 계정으로 로그인을 처리합니다.
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider().credential(idToken);
    const userCredential = await firebase.auth().signInWithCredential(googleAuthProvider);
    const user = userCredential.user;
    // 사용자 데이터베이스에서 사용자를 찾습니다.
    const userSnapshot = await database.ref('users').orderByChild('USER_EMAIL').equalTo(user.email).once('value');
    if (userSnapshot.exists()) {
      const userObj = userSnapshot.val();
      const [uid] = Object.keys(userObj);
      const userInfo = userObj[uid];

      req.session.userName = userInfo.USER_NAME; // 세션에 userName 추가
      res.status(200).json({ message: 'Google 로그인에 성공했습니다.', user: userInfo });
    } else {
      res.status(404).json({ message: '해당 이메일을 사용하는 사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Google 로그인에 실패했습니다. 다시 시도해주세요.' });
  }
};

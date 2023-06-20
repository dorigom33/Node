const { database } = require('../config/firebase');

exports.getMypage = async (req, res) => {
  try {
    const { userName } = req.session;

    // 사용자 데이터베이스에서 현재 로그인한 사용자의 정보를 조회합니다.
    const userSnapshot = await database.ref('users').orderByChild('USER_NAME').equalTo(userName).once('value');
    if (userSnapshot.exists()) {
      const userObj = userSnapshot.val();
      const [uid] = Object.keys(userObj);
      const userInfo = userObj[uid];

      console.log('userInfo:', userInfo);

      res.render('auth/mypage', { user: userInfo, userName: userName });

      // user와 userName 값을 추가하여 템플릿으로 전달합니다.
    } else {
      res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '마이페이지 조회에 실패했습니다. 다시 시도해주세요.' });
  }
};

exports.updateMypage = async (req, res) => {
  try {
    const { userName } = req.session;
    const { USER_NAME, USER_ADD, USER_TEL } = req.body;

    // 사용자 데이터베이스에서 현재 로그인한 사용자의 정보를 업데이트합니다.
    const userSnapshot = await database.ref('users').orderByChild('USER_NAME').equalTo(userName).once('value');
    if (userSnapshot.exists()) {
      const userObj = userSnapshot.val();
      const [uid] = Object.keys(userObj);

      await database.ref('users/' + uid).update({
        USER_NAME,
        USER_ADD,
        USER_TEL,
      });

      res.status(200).json({ message: '마이페이지 정보가 성공적으로 업데이트되었습니다.' });
    } else {
      res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '마이페이지 업데이트에 실패했습니다. 다시 시도해주세요.' });
  }
};

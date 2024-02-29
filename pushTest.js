import fetch from "node-fetch";

const setNotification = async () => {
  // API 엔드포인트 URL 설정
  const apiUrl =
    "https://api.sokind.kr/swagger-ui/index.html#/FCM/sendFCM_AlarmUsingPOST";

  // POST 요청으로 데이터 보내기
  const requestData = {
    alarmType: 4,
    title: "제목",
    body: "내용",
    link: "{푸시카드 url }",
    target_link: "{버튼url}",
    memberKeyList: [7038],
    click_action: "FCM_PLUGIN_ACTIVITY",
  };

  const requestOptions = {
    method: "POST", // POST 요청 설정
    headers: {
      "Content-Type": "application/json", // JSON 데이터 전송
    },
    body: JSON.stringify(requestData), // 데이터를 JSON 문자열로 변환해서 보냅니다.
  };

  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("API 호출이 실패했습니다.");
      }
      return response.json(); // JSON 응답을 파싱
    })
    .then((data) => {
      console.log("API 응답 데이터:", data);
    })
    .catch((error) => {
      console.error("API 호출 중 오류 발생:", error);
    });
};

setNotification();

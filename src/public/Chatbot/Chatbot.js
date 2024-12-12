const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = fileUploadWrapper.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// API setup
const API_KEY = "AIzaSyCFcIpGnH7cNfFaFwBdxsrKwUcruGQSZS0";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// Khởi tạo dữ liệu tin nhắn và tệp của người dùng
const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null,
    },
};

// Lưu trữ lịch sử trò chuyện
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

// Tạo phần tử tin nhắn với các lớp động và trả về nó
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Tạo phản hồi từ bot bằng API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    // Thêm tin nhắn của người dùng vào lịch sử trò chuyện
    chatHistory.push({
        role: "user",
        parts: [
            { text: userData.message },
            ...(userData.file.data ? [{ inline_data: userData.file }] : []),
        ],
    });

    // Tùy chọn yêu cầu API.
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory,
        }),
    };

    try {
        // Lấy phản hồi từ bot thông qua API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        // Trích xuất và hiển thị nội dung phản hồi của bot.
        const apiResponseText = data.candidates[0].content.parts[0].text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .trim();
        messageElement.innerText = apiResponseText;

        // Lọc nội dung liên quan đến "clothes", "fashion" và "product"
        // const lowerCasedText = apiResponseText.toLowerCase();
        // if (lowerCasedText.includes("clothes") || lowerCasedText.includes("fashion") || lowerCasedText.includes("product")) {
        //   messageElement.innerText = apiResponseText;
        // } else {
        //   messageElement.innerText = "I cannot answer questions unrelated to FASHION, CLOTHING, or PRODUCT. Please ask a different question!";
        //   messageElement.style.color = "#ff8800"; // Màu cảnh báo nhẹ
        // }
        const lowerCasedText = apiResponseText.toLowerCase();
        const keywordMatch = fasclothesKeywords.some((keyword) =>
            lowerCasedText.includes(keyword)
        );

        if (keywordMatch) {
            messageElement.innerText = apiResponseText;
        } else if (lowerCasedText.includes("product")) {
            // Nếu tin nhắn chứa từ khóa 'product', gửi người dùng đến trang product-AL.html
            messageElement.innerHTML = `For more details about our products, visit our <a href="../Home/product1-AL.html" target="_blank">Product Page</a>.`;
        } else {
            messageElement.innerText =
                "I cannot answer questions unrelated to FASHION, CLOTHING, or PRODUCT. Please ask a different question.";
            messageElement.style.color = "#ff8800"; // Màu cảnh báo nhẹ
        }

        // Thêm phản hồi của bot vào lịch sử trò chuyện
        chatHistory.push({
            role: "model",
            parts: [{ text: apiResponseText }],
        });
    } catch (error) {
        // Xử lý lỗi trong phản hồi từ API
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        // Đặt lại dữ liệu tệp của người dùng, xóa chỉ báo "đang suy nghĩ", và cuộn lịch sử trò chuyện xuống cuối
        userData.file = {};
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }
};

// Add list of keywords related to web
const fasclothesKeywords = [
    "fashion",
    "clothes",
    "apparel",
    "garments",
    "outfits",
    "dresses",
    "shirts",
    "pants",
    "skirts",
    "shoes",
    "accessories",
    "bags",
    "jewelry",
    "hairstyle",
    "makeup",
    "style",
    "trends",
    "runway",
    "couture",
    "luxury",
    "designer",
    "streetwear",
    "vintage",
    "brand",
    "fabric",
    "material",
    "textiles",
    "collection",
    "fashion show",
    "seasons",
    "ready-to-wear",
    "fashionista",
    "fashion trends",
    "fashion accessories",
    "seasonal collection",
    "catwalk",
    "sustainability",
    "ethical fashion",
];
// Check whether the question is about FasClothes
const isFasClothesRelated = (message) => {
    message = message.toLowerCase();
    return fasclothesKeywords.some((keyword) =>
        message.includes(keyword.toLowerCase())
    );
};

// Xử lý tin nhắn đi của người dùng
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"));
    fileUploadWrapper.classList.remove("file-uploaded");

    // Tạo và hiển thị tin nhắn của người dùng
    const messageContent = `<div class="message-text"></div>
                          ${
                              userData.file.data
                                  ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
                                  : ""
                          }`;

    const outgoingMessageDiv = createMessageElement(
        messageContent,
        "user-message"
    );
    outgoingMessageDiv.querySelector(".message-text").innerText =
        userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    // Mô phỏng phản hồi của bot với chỉ báo "đang suy nghĩ" sau một khoảng trễ
    setTimeout(() => {
        const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path
              d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"/></svg>
          <div class="message-text">
            <div class="thinking-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>`;

        const incomingMessageDiv = createMessageElement(
            messageContent,
            "bot-message",
            "thinking"
        );
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        generateBotResponse(incomingMessageDiv);
    }, 600);
};

// Điều chỉnh chiều cao của trường nhập liệu một cách linh hoạt
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius =
        messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Xử lý phím Enter để gửi tin nhắn
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (
        e.key === "Enter" &&
        !e.shiftKey &&
        userMessage &&
        window.innerWidth > 768
    ) {
        handleOutgoingMessage(e);
    }
});

// Xử lý thay đổi trong trường nhập tệp và xem trước tệp đã chọn
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        fileInput.value = "";
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];

        // Lưu dữ liệu tệp vào userData
        userData.file = {
            data: base64String,
            mime_type: file.type,
        };
    };

    reader.readAsDataURL(file);
});

// Hủy tải tệp lên
fileCancelButton.addEventListener("click", () => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});

// Khởi tạo bộ chọn biểu tượng cảm xúc và xử lý việc chọn biểu tượng cảm xúc
const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if (e.target.id === "emoji-picker") {
            document.body.classList.toggle("show-emoji-picker");
        } else {
            document.body.classList.remove("show-emoji-picker");
        }
    },
});

document.querySelector(".chat-form").appendChild(picker);

sendMessage.addEventListener("click", (e) => handleOutgoingMessage(e));
document
    .querySelector("#file-upload")
    .addEventListener("click", () => fileInput.click());
closeChatbot.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
);

if (lowerCasedText.includes("clothes") || lowerCasedText.includes("fashion"));

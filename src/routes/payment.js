const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const config = require("../config/config");

router.post("/create-payment", async (req, res) => {
    let {
        accessKey,
        secretKey,
        orderInfo,
        partnerCode,
        redirectUrl,
        ipnUrl,
        requestType,
        extraData,
        orderGroupId,
        autoCapture,
        lang,
    } = config;

    // Lấy số tiền từ request body, nếu không có thì dùng giá trị mặc định
    var amount = "100000"; //var amount = (parseFloat(req.body.amount) * 100).toString(); // Chuyển đổi thành số nguyên
    var orderId = partnerCode + new Date().getTime(); // Tạo orderId duy nhất
    var requestId = orderId; // Request ID trùng với orderId để dễ dàng xác định

    // Tạo chuỗi rawSignature trước khi tính toán chữ ký
    var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        (extraData || "") + // Nếu không có extraData, để trống
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        (orderInfo || "") + // Nếu không có orderInfo, để trống
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;

    // Tính toán chữ ký (signature) sử dụng HMAC SHA256
    var signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

    // Dữ liệu gửi đi cho MoMo
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    });
    console.log("Request Body to MoMo API:", requestBody);

    // Các tùy chọn cho axios request
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody),
        },
        data: requestBody,
    };

    let result;
    try {
        // Gửi yêu cầu đến MoMo API
        result = await axios(options);

        // Kiểm tra nếu có payUrl
        if (result.data && result.data.payUrl) {
            // Trả về payUrl cho frontend
            return res.json({
                payUrl: result.data.payUrl,
            });
        } else {
            // Trả về lỗi nếu không có payUrl
            return res.status(400).json({
                message: "Không thể tạo URL thanh toán từ MoMo.",
            });
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        return res.status(500).json({
            statusCode: 500,
            message: error.message,
        });
    }
});

router.post("/callback", async (req, res) => {
    /**
      resultCode = 0: Giao dịch thành công.
      resultCode = 9000: Giao dịch được cấp quyền (authorization) thành công.
      resultCode <> 0: Giao dịch thất bại.
     */
    console.log("callback: ");
    console.log(req.body);
    /**
     * Dựa vào kết quả này để update trạng thái đơn hàng
     * Kết quả log:
     * {
          partnerCode: 'MOMO',
          orderId: 'MOMO1712108682648',
          requestId: 'MOMO1712108682648',
          amount: 10000,
          orderInfo: 'pay with MoMo',
          orderType: 'momo_wallet',
          transId: 4014083433,
          resultCode: 0,
          message: 'Thành công.',
          payType: 'qr',
          responseTime: 1712108811069,
          extraData: '',
          signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
        }
     */

    // Bạn có thể cập nhật trạng thái đơn hàng tại đây, chẳng hạn như lưu vào cơ sở dữ liệu
    return res.status(204).json(req.body);
});

router.post("/check-status-transaction", async (req, res) => {
    const { orderId } = req.body;

    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var accessKey = "F8BBA842ECF85";
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

    const requestBody = JSON.stringify({
        partnerCode: "MOMO",
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: "vi",
    });

    // Options for axios
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/query",
        headers: {
            "Content-Type": "application/json",
        },
        data: requestBody,
    };

    const result = await axios(options);

    return res.status(200).json(result.data);
});

module.exports = router;

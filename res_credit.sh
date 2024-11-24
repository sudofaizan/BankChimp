# killall node test.js
# sleep 1
curl -X POST http://localhost:80/message \
-H "Content-Type: application/json" \
-H "Authorization: Bearer faizanquazi"    \
-d '{"message": "INR 2090.00 credited to A/c no. XX5067 \n on 19-11-24 at 22:01:41 IST. Info - NEFT/DEUTH00432428530/TATA. Chk Bal https://ccm.axbk.in/AXISBK/ltt3Dvko - Axis Bank"}'


# INR 60.00 credited to A/c no. XX5067 on 19-11-24 at 08:01:10 IST. Info - IFT/CB0063153186/202400965. Chk Bal https://ccm.axbk.in/AXISBK/ltt3Dvko - Axis Bank
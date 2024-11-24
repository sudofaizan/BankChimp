# killall node test.js
# sleep 1
curl  -X POST http://localhost:80/message \
-H "Content-Type: application/json" \
-H "Authorization: Bearer faizanquazi"   \
-d '{"message": "INR 10.00 debited\nA/c no. XX5067\n16-11-24, 11:38:40\nUPI/P2M/212326381087/LIFE MEDICO\nNot you? SMS BLOCKUPI Cust ID to 919951860002\nAxis Bank"}'


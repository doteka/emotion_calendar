var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var r_url = require('url');

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1024byte",
    database: "emotion_calendar"
});

var id = 3;
var date = "2020-08-05";
var emoticon_code = 3;
var toDay = "2020-08-19";

var app = http.createServer(function(request, response){
    // db.connect();
    var url = request.url;
    if(url == '/') {
        url = '/index.html';

        // db.connect();
        // db.query("SELECT * FROM emotion", function(err, result, field) {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         console.log("0번에 있는 emoticon_code : " + result[0].emoticon_code);
        //         // db.end();
        //     }
        // });
    // } else if(url == '/add_data') {             // add_emoticon 있어서 안쓸거같은뎅
    //     url = '/index.html';
    //     // db.connect();
    //     db.query(`INSERT INTO \`emotion\`(\`id\`, \`date\`, \`emoticon_code\`) VALUES ("${id}","${date}","${emoticon_code}")`, function(err, result) {
    //         if(err) console.log(err);
    //         else {
    //             console.log("[DB]  데이터가 추가되었습니다.   id : "+id + " date : " + date + " code : " + emoticon_code);
    //             // db.end();
    //
    //             var jsonWrite = {
    //                 date: date,
    //                 code: emoticon_code
    //             }
    //             var json_String = JSON.stringify(jsonWrite);
    //
    //
    //             fs.appendFile('emotion.json', json_String, function (error) {
    //                 console.log("[JSON] 데이터가 추가되었습니다.");
    //             });
    //         }
    //     });
    } else if(url == '/to_day_data') {
        url = '/index.html';
        // db.connect();
        db.query(`SELECT * FROM emotion WHERE date = "${toDay}"`, function(err, result) {
            if(err) {
                console.log(err);
            } else {
                // console.log("[데이터가 조회되었습니다] date 레이블의 값이 [" + toDay +"]인 날의 emoticon_code의 값은 : " + result[0].emoticon_code);
                // db.end();
            }
        });
    } else if(r_url.parse(request.url, true).pathname == '/add_emoticon') {
        url = '/index.html';
        var code = r_url.parse(request.url, true).query;
        var id_a = 1 + Math.floor(Math.random() * 1000);

        console.log("[Debug] " + `SELECT * FROM emotion WHERE date = "${code.date}"`);
        db.query(`SELECT * FROM emotion WHERE date = "${code.date}"`, function(err, result) {
            console.log("result : " + result[0]);
            if(err) {
                console.log(err);
            } else if(result[0] == undefined) {
                db.query(`INSERT INTO \`emotion\`(\`id\`, \`date\`, \`emoticon_code\`) VALUES ("${id_a}","${code.date}","${code.code}")`,function(err) {
                    if(err) console.log(err);
                    else {
                        console.log("[DB] 데이터가 생성되었습니다. "+`id : ${id_a} date : ${code.date} Emoticon_code : ${code.code}`);

                        var json_File = {
                            date: code.date,
                            emoticon: code.code
                        }
                        var json_String = JSON.stringify(json_File);


                        fs.appendFile('emotion.json', json_String, function (error) {
                            console.log("[JSON] 데이터가 생성되었습니다.");
                        });
                    }
                });
                console.log("[code] : " + code.code);
            } else {
                console.log("하나의 감정만 표현 가능합니다.");
            }
        });
    } else if(url =='/all_delete') {
        url = '/index.html';
        db.query("DELETE FROM `emotion`",function(err) {
           if(err) console.log(err);
           else {
               console.log("[DB] 모든 데이터가 삭제되었습니다.");
               fs.unlink('emotion.json', function(error) {
                   console.log("[JSON] 모든 데이터가 삭제되었습니다.");
               });
           }
        });
    }

    if(url == '/favicon.ico') {
        response.writeHead(404);
        response.end();
        // db.end();
        return;
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000);
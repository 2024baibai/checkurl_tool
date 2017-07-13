/**
 * Created by york on 17-5-16.
 */

"use strict";

//将form转为AJAX提交
function ajaxSubmit(frm, fn) {
    let dataPara = getFormJson(frm);
    $.ajax({
        url: frm.action,
        type: frm.method,
        dataType: "json",
        data: dataPara,
        success: function(data) {
                let tableBody = document.getElementById('tableBody'),
                    result = document.getElementById('result'),
                    tongji=document.getElementById('url_tongji');
                let outLinks = document.getElementById('outLinks'),
                    okLinks = document.getElementById('okLinks'),
                    noLnks = document.getElementById('noLnks');
                tableBody.innerHTML = '';
                result.style.display="block";
                tongji.style.display="block";
                let for_data = JSON.parse(JSON.stringify(data));
                let urls = for_data.urls;
                outLinks.innerHTML = urls.length;
                okLinks.innerHTML=0;
                noLnks.innerHTML=0;
                let ok_num = 0,no_num = 0;
                for (let index in urls) {
                    let u_url = urls[index];
                    if (u_url) {
                        let ua_host = u_url.url,ua_status = u_url.status,ua_exists = u_url.exists;

                        let tr = document.createElement('tr'), td_id = document.createElement('td'), td_name = document.createElement('td'), td_status = document.createElement('td'), td_has_host = document.createElement('td');
                        td_id.className="col-xs-6 col-sm-3"
                        td_name.className="col-xs-6 col-sm-3"
                        td_status.className="col-xs-6 col-sm-3"
                        td_has_host.className="col-xs-6 col-sm-3"

                        td_id.innerHTML = parseInt(index) + 1;

                        let td_name_a = document.createElement('a');
                        td_name_a.setAttribute('href', ua_host);
                        td_name_a.setAttribute('target', '_black');
                        td_name_a.innerHTML = ua_host;
                        td_name.appendChild(td_name_a);

                        td_status.innerHTML = ua_status;
                        td_has_host.innerHTML = ua_exists;

                        tr.appendChild(td_id);
                        tr.appendChild(td_name);
                        tr.appendChild(td_status);
                        tr.appendChild(td_has_host);
                        //tr.className = 'text-left';
                        tableBody.appendChild(tr);


                        // 取友链信息
                        $.post('/link_ua', {
                            'word': dataPara.word,
                            'url': ua_host,
                        }, function (data) {
                            if (data.code === 0) {
                                // 显示友链信息
                                let td_h0_span = document.createElement('span');
                                if (data.status==='normal') {
                                    td_h0_span.innerHTML = '访问正常';
                                    td_h0_span.className = 'text-success';
                                } else {
                                    td_h0_span.innerHTML = '疑似死链';
                                    td_h0_span.className = 'text-warning';
                                }
                                td_status.innerHTML = '';
                                td_status.appendChild(td_h0_span);
                                let td_h_span = document.createElement('span');
                                if (data.exists==='Yes') {
                                    td_h_span.innerHTML = '存在反链';
                                    td_h_span.className = 'text-success';
                                    ok_num+=1;
                                } else {
                                    td_h_span.innerHTML = '无反链';
                                    td_h_span.className = 'text-warning';
                                    no_num+=1;
                                }
                                okLinks.innerHTML = ok_num;
                                noLnks.innerHTML = no_num;
                                td_has_host.innerHTML = '';
                                td_has_host.appendChild(td_h_span);
                            }
                        })
                    }
                }
            }
    });
}

//将form中的值转换为键值对。
function getFormJson(frm) {
    let o = {};
    let a = $(frm).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });

    return o;
}

$(document).ready(function(){
    $('#CheckForm').bind('submit', function(){
        ajaxSubmit(this, function(data){
            alert(data);
        });
        return false;
        timeout: 300000;
    });
});

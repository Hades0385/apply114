$(document).ready(function() {
    let universityData = [];

    // 讀取 JSON 檔案
    $.getJSON('data.json', function(data) {
        universityData = data['data'];

        const indexList = $('#index-list');
        indexList.empty();  // 清空現有選項
        indexList.append('<li><a class="dropdown-item" href="#" id="default-option">請選擇</a></li>');
        const uniqueSchools = [...new Set(universityData.map(item => item.校名))];
        uniqueSchools.forEach(school => {
            indexList.append(`
                <li><a class="dropdown-item" href="#" data-school-name="${school}">${school}</a></li>
            `);
        });
    }).fail(function() {
        alert('無法讀取資料，請確認 JSON 檔案是否正確。');
    });

    let applyData = [];

    $.getJSON('applyData.json', function(data) {
        applyData = data['Data'];
    }).fail(function() {
        alert('無法讀取 applyData.json，請確認檔案是否正確。');
    });

    // 確保 Fuse.js 已載入
    console.log("Fuse 是否存在:", typeof Fuse);

    // 初始化 Fuse.js
    let fuse;
    function initFuse() {
        if (universityData.length > 0) {
            fuse = new Fuse(universityData, {
                keys: ['校名', '校系'],
                threshold: 0.3 // 控制匹配精確度
            });
        }
    }

    // 監聽資料加載完成後初始化 Fuse.js
    $(document).ajaxStop(function() {
        initFuse();
    });

    // 當使用者選擇學校後，載入該學校的資料
    $(document).on('click', '#index-list .dropdown-item', function(event) {
        event.preventDefault(); // 防止跳轉

        const schoolName = $(this).text(); // 取得選中的學校名稱

        // 如果選擇 "請選擇"，清除所有資料
        if (schoolName === "請選擇") {
            $('#navbarDropdown').text("學校名單");
            $('#table-data').empty();  
        } else {
            $('#navbarDropdown').text(schoolName); // 更新選擇的學校名稱
            const selectedSchoolData = universityData.filter(item => item.校名 === schoolName);
            if (selectedSchoolData.length > 0) {
                renderTable(selectedSchoolData);  // 渲染該學校的資料
            }
        }
    });

    // 渲染表格的函數
    function renderTable(data) {
        const tableBody = $('#table-data');
        tableBody.empty(); // 清空現有資料
        
        data.forEach(item => {
            
            const applyItem = applyData.find(apply => apply['校系代碼'] === item['校系代碼']);
            const 篩選資料 = applyItem ? applyItem['篩選資料'] : 'ND';  // 如果找不到，顯示 ND
        
            const row = `
                <table class="table table-bordered table-dark">
                <tr><!--標題欄位-->
                    <td colspan="2"  rowspan="2">
                        <div><h5>${item.校名}</h5></div>
                        <div>${item.校系}</div>
                    </td>
                    <td colspan="4" class="text-center">第一階段</td>
                    <td colspan="5" class="text-center">第二階段</td>
                    <td colspan="2" rowspan="2" class="text-center align-middle">甄選總成績同分參酌之順序</td>
                </tr>
                <tr><!--第二橫列-->
                    <td colspan="2" class="text-center">科目</td>
                    <td class="text-center">檢定</td>
                    <td class="text-center">篩選倍率</td>
                    <td class="text-center">學測成績採計方式</td>
                    <td class="text-center">佔甄選總成績比例</td>
                    <td class="text-center">指定項目</td>
                    <td class="text-center">檢定</td>
                    <td class="text-center">佔甄選總成績比例</td>
                </tr>
                <tr><!--第三橫列-->
                    <td class="nowrap">校系代碼</td>
                    <td><a href="https://www.cac.edu.tw/apply114/system/ColQry_114applyXForStu_Fd87eO2q/html/114_${item.校系代碼}.htm?v=1.0" target="_blank" style="color:#FFECF5;">${item.校系代碼}</a></td>
                    <td colspan="2" rowspan="3" class="text-center nowrap">${item.科目}</td>
                    <td rowspan="3" class="text-center nowrap">${item.學測檢定標準}</td>
                    <td rowspan="3" class="text-center nowrap">${item.篩選倍率}</td>
                    <td rowspan="3" class="text-center nowrap">${item.學測採計方式}</td>
                    <td rowspan="3" class="text-center nowrap">${item.學測占比}</td>
                    <td rowspan="3" class="text-center nowrap">${item.甄試項目}</td>
                    <td rowspan="3" class="text-center nowrap">${item.甄試標準}</td>
                    <td rowspan="3" class="text-center nowrap">${item.甄試占比}</td>
                    <td rowspan="3" class="text-center nowrap">${item.同分篩選}</td>
                </tr>
                <tr><!--第四橫列-->
                    <td class="nowrap">招生名額</td>
                    <td>${item.招生名額}</td>
                </tr>
                <tr><!--第五橫列-->
                    <td class="nowrap">預計甄試人數</td>
                    <td>${item.預計甄試人數}</td>
                </tr>
                <tr><!--第六橫列-->
                    <td class="nowrap">甄試費用</td>
                    <td>${item.指定項目甄試費}</td>
                    <td colspan="2" rowspan="2" class="text-center  align-middle">審查資料</td>
                    <td colspan="8" rowspan="2" style="max-width: 300px;">${item.項目}<br>${item.項目說明}</td>
                </tr>
                <tr><!--第七橫列-->
                    <td class="nowrap">甄試日期</td>
                    <td>${item.甄試日期}</td>
                </tr>
                <tr><!--第八橫列-->
                    <td class="nowrap">榜示</td>
                    <td>${item.榜示}</td>
                    <td colspan="2" class="text-center align-middle nowrap">說明</td>
                    <td colspan="8">${item.說明}</td>
                </tr>
                <tr><!--第九橫列-->
                    <td class="nowrap" colspan="2">113最低率取標準</td>
                    <td colspan="10">${篩選資料}</td>
                </tr>
            </table>
            
            `;
            tableBody.append(row);
        });
    }

    // 使用 Fuse.js 進行模糊搜尋
    $('#search-form').submit(function(event) {
        event.preventDefault(); // 防止表單默認提交行為
        const searchTerm = $('#search-input').val().trim();

        if (searchTerm === '') {
            $('#navbarDropdown').text("學校名單"); 
            $('#table-data').empty();  
        } else {
            if (fuse) {
                const result = fuse.search(searchTerm).map(res => res.item);
                renderTable(result);
            } else {
                alert("搜尋功能初始化失敗，請確認資料是否正確加載。");
            }
        }
    });

    // 回到頂端按鈕功能
    $('#scrollToTop').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // 滾動事件來顯示/隱藏回到頂端按鈕
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('#scrollToTop').fadeIn(); 
        } else {
            $('#scrollToTop').fadeOut(); 
        }
    });

    // 頁面載入時隱藏回到頂端按鈕
    $('#scrollToTop').hide();
});
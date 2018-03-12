// 百度地图API功能
var map = new BMap.Map("allmap");    // 创建Map实例
map.centerAndZoom(new BMap.Point(114.06, 22.54), 12);  // 初始化地图,设置中心点坐标和地图级别
//添加地图类型控件
map.addControl(new BMap.NavigationControl());
map.addControl(new BMap.ScaleControl());
map.addControl(new BMap.MapTypeControl({
    mapTypes:[
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
    ]}));
map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

//************************站点图**********************//
$("#subwayshow").click(function() {
    var inputlinename = $(" #linename ").val()//获取输入值
    if(!inputlinename){
        alert("请输入查询线路！");}
    else {
        $.ajax({
            url: 'test/test.php',
            type: 'POST',
            data: {data:"subway",data2:inputlinename},
            success: function (data) {
                console.log(data);

                successCallback(data);
            },
            error: function () {
                alert("no php");
            }
        });
    }
});

function successCallback(data) {
    if (data==0) {
        console.log("输入有误");
        alert('输入有误！\n\n输入示例："一号线"、"地铁二号线"、"七"')
    }
    else {
        map.clearOverlays();
        var strs = new Array();
        strs = data.split(";");
        for (var i = 0; i < strs.length; i++) {
            var str = new Array();
            str[i] = strs[i].split(",");
            var long = str[i][2];
            var lat = str[i][3];
            var myIcon = new BMap.Icon("/test/resource/sub2.png", new BMap.Size(30, 30));
            var marker = new BMap.Marker(new BMap.Point(long, lat), {icon: myIcon});  // 创建标注
            var content = str[i][0];
            map.addOverlay(marker);               // 将标注添加到地图中
            addClickHandler(content, marker);
        }
    }

}
//弹出窗口设置
var opts = {
    width : 220,     // 信息窗口宽度
    height: 60,     // 信息窗口高度
    title : "站点" , // 信息窗口标题
    enableMessage:true//设置允许信息窗发送短息
};
//弹出窗口函数
function addClickHandler(content,marker){
    marker.addEventListener("click",function(e){
        openInfo(content,e)}
    );
}
function openInfo(content,e){
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow,point); //开启信息窗口
}
//*********************站点图end********************//
//**********************热力图*********************//

//显示热力图
$('#hotshow').click(function () {
    map.clearOverlays();
    $('#hotpowerdiv').css("visibility","");
    $.ajax({
        url: 'test/test.php',
        type: 'POST',
        data: {data:"hotpower"},
        success: function (data) {
            hotpowersuccessCallback(data);
        },
        error: function () {
            alert("no php");
        }
    });
});
function hotpowersuccessCallback(data){
    var obj = eval('(' + data + ')');//转为object
    console.log(obj);
    var points = obj;
    if(!isSupportCanvas()){
        alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
    }
    //详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
    //参数说明如下:
    /* visible 热力图是否显示,默认为true
     * opacity 热力的透明度,1-100
     * radius 势力图的每个点的半径大小
     * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
     *	{
            .2:'rgb(0, 255, 255)',
            .5:'rgb(0, 110, 255)',
            .8:'rgb(100, 0, 255)'
        }
        其中 key 表示插值的位置, 0~1.
            value 为颜色值.
     */
    heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":25});
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data:points,max:100000});
}
function setGradient(){

    var gradient = { 0:'rgb(102, 255, 0)',
        .5:'rgb(255, 170, 0)',
        1:'rgb(255, 0, 0)'};
    var colors = document.querySelectorAll("input[type='color']");
    colors = [].slice.call(colors,0);
    colors.forEach(function(ele){
        gradient[ele.getAttribute("data-key")] = ele.value;
    });
    heatmapOverlay.setOptions({"gradient":gradient});
}

//判断浏览区是否支持canvas
function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

//不显示热力图
$('#hotnotshow').click(function () {
    map.clearOverlays();
    $('#hotpowerdiv').css("visibility","hidden");
});

//**********************热力图end*********************//

//*********************热力时间选择**********************//
$('#selecttime').change(function () {
    map.clearOverlays();
    var selecttimename=$('#selecttime').val();
    $.ajax({
        url: 'test/test.php',
        type: 'POST',
        data: {data: "selecttime", data5: selecttimename},
        success: function (data) {
            selecttimesuccessCallback(data);
        },
        error: function () {
            alert("no php");
        }
    });
});

function selecttimesuccessCallback(data){
    var obj = eval('(' + data + ')');//转为object
    console.log(obj);
    var points = obj;
    if(!isSupportCanvas()){
        alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
    }
    heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":25});
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data:points,max:12000,});

}

//*********************热力时间选择end*******************//

//**********************站点选择**********************//
$('#selectline').change(function () {
    var selectlinename = $(" #selectline").val()//获取选择值
    $.ajax({
        url: 'test/test.php',
        type: 'POST',
        data: {data:"select",data3:selectlinename},
        success: function (data) {
            selectsuccessCallback(data);
        },
        error: function () {
            alert("no php");
        }
    });
});

function selectsuccessCallback(data) {
    var strs = new Array();
    strs = data.split(";");
    console.log(data);
    appendselect(strs);
}
//站点选项添加
function appendselect(strs) {
    $("#selectstation option").remove();//清空
    var selObj = $("#selectstation");
    for(var i=0;i<strs.length-1;i++){
        var value=strs[i];
        var text=strs[i];
        selObj.append("<option value='"+value+"'>"+text+"</option>");
    }
}

$('#selectstation').change(function () {
    var selectstationname = $(" #selectstation").val()//获取选择值
    $.ajax({
        url: 'test/test.php',
        type: 'POST',
        data: {data:"selectstation",data4:selectstationname},
        success: function (data) {
            selectstationsuccessCallback(data);
        },
        error: function () {
            alert("no php");
        }
    });
});
function selectstationsuccessCallback(data) {
    console.log(data);
    map.clearOverlays();
    var str = new Array();
    str = data.split(";");
    var long = str[1];
    var lat = str[2];
    var myIcon = new BMap.Icon("/test/resource/sub2.png", new BMap.Size(30, 30));
    var marker = new BMap.Marker(new BMap.Point(long, lat), {icon: myIcon});  // 创建标注
    var content = str[0];
    map.addOverlay(marker);               // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    addClickHandler(content, marker);

}
//*********************站点选择end**********************//
//*********************站点人流图**********************//
$('#selectline2').change(function () {
    var selectlinename2 = $(" #selectline2").val()//获取选择值
    $.ajax({
        url: 'test/test.php',
        type: 'POST',
        data: {data:"select",data3:selectlinename2},
        success: function (data) {
            select2successCallback(data);
        },
        error: function () {
            alert("no php");
        }
    });
});

function select2successCallback(data) {
    var strs = new Array();
    strs = data.split(";");
    console.log(data);
    $("#selectstation2 option").remove();//清空
    var selObj = $("#selectstation2");
    for(var i=0;i<strs.length-1;i++){
        var value=strs[i];
        var text=strs[i];
        selObj.append("<option value='"+value+"'>"+text+"</option>");
    }
}

$('#selectstation2').change(function () {
    var selectstationname2 = $(" #selectstation2").val()//获取选择值
    $.ajax({
        url: 'test/test.php',
        type: 'POST',
        data: {data:"selectstation2",data6:selectstationname2},
        success: function (data) {
            selectstation2successCallback(data);
        },
        error: function () {
            alert("no php");
        }
    });
});
function selectstation2successCallback(data) {
console.log(data);
var beijingPosition=new BMap.Point(114.132045,22.410683),
        hangzhouPosition=new BMap.Point(114.029721,22.4629),
        taiwanPosition=new BMap.Point(113.991121,22.517053);
    var points = [beijingPosition, hangzhouPosition,taiwanPosition];

    var curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:5, strokeOpacity:0.9}); //创建弧线对象
    map.addOverlay(curve); //添加到地图中
}


//*********************站点人流图end**********************//
//*********************公交线路查询**********************//
$("#busshow").click(function() {
    var inputbusname = $("#busname ").val()//获取输入值
    if(!inputbusname){
        alert("请输入查询线路！");}
    else {
       /* $.ajax({
            url: 'test/test.php',
            type: 'POST',
            data: {data:"bus",data7:inputbusname},
            success: function (data) {
                bussuccessCallback(data);
            },
            error: function () {
                alert("no php");
            }
        });*/
       var busline = new BMap.BusLineSearch(map,{
            renderOptions:{map:map},
            onGetBusListComplete: function(result){
                if(result) {
                    var fstLine = result.getBusListItem(0);//获取第一个公交列表显示到map上
                    busline.getBusLine(fstLine);
                }
            }
        });
        setTimeout(function(){
            busSearch();
        },1000);
        function busSearch(){
            var busName = inputbusname;
            busline.getBusList(busName);
        }
    }
});

function bussuccessCallback(data) {

}



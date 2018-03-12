

<?php
define("myservername","127.0.0.1");
define("myusername", "root");
define("mypassword","soulmate000");
/*
// 创建连接
$conn = new mysqli(myservername, myusername, mypassword);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}*/
$data=$_POST[data];//获取按键指令
switch ($data){
    case hotpower:
        hotpower();
    break;
    case subway:
        $data2=$_POST[data2];//用户输入指令
        subway($data2);
    break;
    case select:
        $data3=$_POST[data3];
        selectline($data3);
    break;
    case selectstation:
        $data4=$_POST[data4];
        selectstation($data4);
    break;
    case selecttime:
        $data5=$_POST[data5];
        selecttime($data5);
    break;
    case selectstation2:
        $data6=$_POST[data6];
        stationpop($data6);
        break;
    case bus:
        $data7=$_POST[data7];
        bus($data7);
        break;
    default:echo "0";
}
//地铁线路查询
function subway($data2)
{
    $conn = new mysqli(myservername, myusername, mypassword);
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    }
    else {
        $sql = "SELECT * FROM szt2.count_and_position2 where locationline like '%$data2%'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // 输出数据
            while ($row = $result->fetch_assoc()) {
                echo $row["locationline"] . "," . $row["longitude"] . "," . $row["latitude"] . ";";
            }
        }
        else {
            echo "0";
        }

    }
    $conn->close();
}

function hotpower()
{
    $conn = new mysqli(myservername, myusername, mypassword);
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    }
    else {
        $sql = "SELECT longitude,latitude,count FROM szt2.count_and_position2 ORDER by count DESC";
        $result = $conn->query($sql);
        $rowsnum =$result->num_rows;
        if ($rowsnum> 0) {
            $arr=array();
            class point{
                public $lng;
                public $lat;
                public $count;
            }
            while($row=mysqli_fetch_object($result)){
                $s=new point();
                $s->lng=$row->longitude;
                $s->lat=$row->latitude;
                $s->count=$row->count;
                //填充数组
                $arr[]=$s;
            }
            echo json_encode($arr);
        }
        else {
            echo "0";
        }
    }
    $conn->close();
}
//线路选择
function selectline($data3){
    $conn = new mysqli(myservername, myusername, mypassword);
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    }
    else{
        $sql = "SELECT * FROM szt2.locations_of_line where line like '%$data3%' and location not like'%none%'";//待修改 部分中转站未显示
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            // 输出数据
            while ($row = $result->fetch_assoc()) {
                echo $row["location"].";";
            }
        }
        else{
            echo "0";
        }
    }
    $conn->close();
}
//站点选择
function selectstation($data4){
     $conn = new mysqli(myservername, myusername, mypassword);
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    }
    else{
        $sql = "SELECT * FROM szt2.count_and_position2 where locationline like '%$data4%'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            // 输出数据
            while ($row = $result->fetch_assoc()) {
                echo $row["locationline"] . ";" . $row["longitude"] . ";" . $row["latitude"];
            }
        }
        else{
            echo "0";
        }
    }
    $conn->close();
}
//热力图时间选择
function selecttime($data5){
    $conn = new mysqli(myservername, myusername, mypassword);
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    }
    else {
        $sql1 = "SELECT longitude,latitude FROM szt2.count_and_position2 ORDER by count DESC";
        $sql2 = "SELECT count,name FROM szt2.station_count_hour where hour='$data5'";
        $result2 =$conn->query($sql2);
        $result1 = $conn->query($sql1);
        $rowsnum1 =$result1->num_rows;$rowsnum2 =$result1->num_rows;
        if ($rowsnum1> 0 and $rowsnum2>0) {
            $arr=array();
            class point{
                public $lng;
                public $lat;
                public $count;
            }
            while($row=mysqli_fetch_object($result1)and$row2=mysqli_fetch_object($result2)){
                $s=new point();
                $s->lng=$row->longitude;
                $s->lat=$row->latitude;
                $s->count=$row2->count;
                //填充数组
                $arr[]=$s;
            }
            echo json_encode($arr);
        }
        else {
            echo "0";
        }
    }
    $conn->close();
}
//人口流量
function stationpop($data6){
    $conn = new mysqli(myservername, myusername, mypassword);
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    }
    else {
        $sql="";
        $result=$conn->query($sql);
    }
}
//公交线路查询
/*function bus($data7){
    $conn = new mysqli(myservername, myusername, mypassword);
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    }
    else {
        $sql="";
        $result=$conn->query($sql);
    }
}*/
?>


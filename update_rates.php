<?php session_start();
ini_set('max_execution_time', 600);
/*
ini_set('display_errors', false);
error_reporting(0);
session_start();
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Content-Type: application/xml; charset=utf-8");
*/

include('../../../../wp-load.php');
global $wpdb;
global $mk_options;

$admin_email = $mk_options['bookin_email'];

/*=== Global Variables ===*/
$adivaha_key =$mk_options['adivaha_key'];
//$default_currency = $mk_options['default_currency'];
//$default_language = $mk_options['default_language'];
$ModeType = $mk_options['booking_mode'];

$cid = trim($mk_options['ean_cid']);
$apiKey = trim($mk_options['ean_api']);
$secret = trim($mk_options['secret_key']);
$minorRev = trim($mk_options['minorRev']);

$actionUrl = $mk_options['ean_url'];



$timestamp = gmdate('U');
$sig = md5($apiKey . $secret . $timestamp);

$limit =18;
$offset=0;

$customerIP =$_SERVER['REMOTE_ADDR'];

//Request Values
$lat = $_REQUEST['lat'];
$lon = $_REQUEST['lon'];
$desti_lat_lon =$_REQUEST['lat'].'-'.$_REQUEST['lon'];
$search_Session_Id = $_REQUEST['search_Session_Id'];
$checkIn = $_REQUEST['checkIn'];
$checkOut = $_REQUEST['checkOut'];
$Cri_Adults = $_REQUEST['Cri_Adults'];

if($_REQUEST['Cri_currency']!=''){
  $_SESSION['Cri_currency']=$_REQUEST['Cri_currency'];
}else{
  $_SESSION['Cri_currency']=$default_currency;	
}   

if($_REQUEST['Cri_language']!=''){
 $_SESSION['Cri_language'] = $_REQUEST['Cri_language'];
}


$orderby_val = $_REQUEST['orderby_val'];

if($orderby_val == "true"){
	$orderby_val = "asc";
}else{
	$orderby_val = "desc";
}
$adults = 2;


//=== Session ===//

if($_REQUEST["action"]=="findSearchKey"){
	$_SESSION['checkIn']=$_REQUEST['checkIn'];
	$_SESSION['checkOut']=$_REQUEST['checkOut'];
	$_SESSION['no_of_rooms']=$_REQUEST['rooms'];
	
	$adults =explode(",",$_REQUEST['adults']);
	$childs =explode(",",$_REQUEST['childs']);
	$childAge =explode(",",$_REQUEST['childAge']);
	//$childAge =explode(",",$_REQUEST['childAge']);
	$childAge_data =$childAge;
	$childAge =array();
	for($i=0;$i<$_REQUEST['rooms'];$i++){
		$childCont =$childs[$i];
		if($childCont>0){
			for($c=0;$c<$childCont;$c++){
			 $childAge[$i][] =$childAge_data[$i];	
			}
		}
	}
	$_SESSION['Cri_Pacs'] = array('adults'=>$adults,
								 'childs'=>$childs,
								 'childAge'=>$childAge
								 );
}
//=== End Session ===//							 

//$Param = "adivaha_key=".$adivaha_key."&cid=".$cid."&apiKey=".$apiKey."&secret=".$secret."&minorRev=".$minorRev."&Cri_language=".$_SESSION['Cri_language']."&Cri_currency=".$_SESSION['Cri_currency'].'&ModeType='.$ModeType;

$Param = "adivaha_key=".$adivaha_key."&Cri_language=".$_SESSION['Cri_language']."&Cri_currency=".$_SESSION['Cri_currency'].'&ModeType='.$ModeType;  


if($_REQUEST["action"]=="findSearchKey"){
	$num = 0;
	
	$checkIn_db =date('Y-m-d',strtotime($_REQUEST['checkIn']));
	$checkOut_db =date('Y-m-d',strtotime($_REQUEST['checkOut']));
	
	$moreQuery =" and currency='".$_SESSION['Cri_currency']."' and language='".$_SESSION['Cri_language']."' and LowRate>0";
	
	if(($_REQUEST['hotelType']!='') && ($_REQUEST['hotelType']!=1) ){
		$moreQuery.=' and propertyCategory='.$_REQUEST['hotelType'];
	}

	$wpdb->query("delete from search_results_ean where desti_lat_lon='".$desti_lat_lon."' ".$moreQuery." and date_time<'".date('Y-m-d', strtotime('-2 day', strtotime(date('Y-m-d'))))."'");
	
	
	$results = $wpdb->get_results("select search_session, count(*) as total_hotel from search_results_ean where desti_lat_lon='".$desti_lat_lon."' ".$moreQuery." and is_custom!=1 limit 0, 1");
	
	
	$checkObj =$results[0];
	$search_Session_Id = $checkObj->search_session;
	
	if($checkObj->total_hotel > 0){
	 /*== Add update custom hotel if already exist in data==*/	
	 update_custom_hotels($lat,$lon,$desti_lat_lon,$checkIn_db,$checkOut_db,$search_Session_Id,$sort_order); 
	 
	$sql ="SELECT count(EANHotelID) as totalrecords, 
	(select count(EANHotelID) from search_results_ean where hotelRating IN(4.5,5) and search_session='".$search_Session_Id."' ".$moreQuery.") as stars5, 
	(select count(EANHotelID) from search_results_ean where hotelRating IN(3.5,4) and search_session='".$search_Session_Id."' ".$moreQuery.") as stars4, 
	(select count(EANHotelID) from search_results_ean where hotelRating IN(2.5,3) and search_session='".$search_Session_Id."' ".$moreQuery.") as stars3, 
	(select count(EANHotelID) from search_results_ean where hotelRating IN(1.5,2) and search_session='".$search_Session_Id."' ".$moreQuery.") as stars2, 
	(select count(EANHotelID) from search_results_ean where hotelRating IN(1) and search_session='".$search_Session_Id."' ".$moreQuery.") as stars1, 
	(select count(EANHotelID) from search_results_ean where hotelRating IN(0) and search_session='".$search_Session_Id."' ".$moreQuery.") as stars0,
	(select count(EANHotelID) from search_results_ean where proximityDistance<=2 and search_session='".$search_Session_Id."' ".$moreQuery.") as distance2,
  (select count(EANHotelID) from search_results_ean where  proximityDistance<=5 and search_session='".$search_Session_Id."' ".$moreQuery.") as distance5,
  (select count(EANHotelID) from search_results_ean where proximityDistance<=10 and search_session='".$search_Session_Id."' ".$moreQuery.") as distance10,
  (select count(EANHotelID) from search_results_ean where proximityDistance<=20 and search_session='".$search_Session_Id."' ".$moreQuery.") as distance20,
  (select count(EANHotelID) from search_results_ean where proximityDistance<=50 and search_session='".$search_Session_Id."' ".$moreQuery.") as distance50,
	
	(select min(lowrate) from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery.") as minrate , 
	(select max(lowrate) as maxrate from search_results_ean where search_session='".$search_Session_Id."'  ".$moreQuery.") as maxrate,
	(select MIN(tripAdvisorRating) from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery.") as minguest,
	(select MAX(tripAdvisorRating) from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery.") as maxguest FROM search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery." ";
  
	$results = $wpdb->get_results($sql); 
	$obj =$results[0];
	
	$Sqls = "select EANHotelID,Name,hotelRating,confidenceRating,address1,lowRate,highRate,discount_price,latitude,longitude, thumbNailUrl, tripAdvisorRatingUrl from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery." limit 0,15"; 
	 
    $rresults = $wpdb->get_results($Sqls);
	$tripAdvisorRatingUrl=str_replace("http", "https", $Objs->tripAdvisorRatingUrl);
	foreach( $rresults as $Objs ){
		$data[] =array('hotelId'=>$Objs->EANHotelID,'name'=>stripslashes($Objs->Name),'thumbNailUrl'=>stripslashes($Objs->thumbNailUrl),'hotelRating'=>stripslashes($Objs->hotelRating),'popularity'=>stripslashes($Objs->confidenceRating),'tripAdvisorRatingUrl'=>stripslashes($tripAdvisorRatingUrl),'address1'=>stripslashes($Objs->address1), 'lowRate'=>'-1','highRate'=>'','discount_price'=>'...');
	}
	
	$arr =array('search_session'=>$search_Session_Id,'exist'=>'Yes', 'totalrecords'=>$obj->totalrecords,'stars5'=>$obj->stars5,'stars4'=>$obj->stars4,'stars3'=>$obj->stars3,'stars2'=>$obj->stars2,'stars1'=>$obj->stars1,'stars0'=>$obj->stars0,'distance2'=>$obj->distance2,'distance5'=>$obj->distance5,'distance10'=>$obj->distance10,'distance20'=>$obj->distance20,'distance50'=>$obj->distance50,'minrate'=>floor($obj->minrate),'maxrate'=>ceil($obj->maxrate),'minguest'=>$obj->minguest,'maxguest'=>$obj->maxguest,'results'=>$data);
	
	echo json_encode($arr);
	die();
	}else{ 
		$arr =array('search_session'=> uniqid(),'exist'=>'No');
		echo json_encode($arr);
	}
}


if($_REQUEST["action"]=="Upldate_Rates"){
	
	$ext_param ='&latitude='.$lat.'&longitude='.$lon.'&checkIn='.$_SESSION['checkIn'].'&checkOut='.$_SESSION['checkOut'].'&no_of_rooms='.$_SESSION['no_of_rooms'].'&Cri_Pacs='.json_encode($_SESSION['Cri_Pacs']);
	$URL = $actionUrl.'?action=Upldate_Rates&numberOfResults=15&'.$Param.$ext_param; 
	//$contents =file_get_contents($URL);
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $URL);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	$contents = curl_exec($ch);
	curl_close ($ch);
	echo $contents ;
}

if($_REQUEST["action"]=="Upldate_Rates_All"){
	
		$ext_param ='&latitude='.$lat.'&longitude='.$lon.'&checkIn='.$_SESSION['checkIn'].'&checkOut='.$_SESSION['checkOut'].'&no_of_rooms='.$_SESSION['no_of_rooms'].'&Cri_Pacs='.json_encode($_SESSION['Cri_Pacs']);
		
		$URL = $actionUrl.'?action=Upldate_Rates&numberOfResults=200&'.$Param.$ext_param;
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $URL);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		$results = curl_exec($ch);
		curl_close ($ch);
	
		$Response_Arr =json_decode($results, true);
		
		$HotelListResponse =$Response_Arr['HotelListResponse'];
		$customerSessionId =$HotelListResponse['customerSessionId'];
		$cacheLocation =$HotelListResponse['cacheLocation'];
		$cacheKey =$HotelListResponse['cacheKey'];
		$moreResultsAvailable =$HotelListResponse['moreResultsAvailable'];
		
		$HotelList =$HotelListResponse['HotelList'];
		$size = $HotelList['@size'];
		$activePropertyCount =$HotelList['@activePropertyCount'];
		$Countsize = 0;
		$activePropertyCount_justtocount = $activePropertyCount;
		$pageCount=0;
		if($activePropertyCount > $size){
		  $pageCount =ceil($activePropertyCount/$size);
		}
		
		if($size >1){
			$HotelList_arr =$HotelList['HotelSummary'];
		}else{
			$HotelList_arr[0] =$HotelList['HotelSummary'];
		}
		
		
		$checkIn_db =date('Y-m-d',strtotime($checkIn));
		$checkOut_db =date('Y-m-d',strtotime($checkOut));
		
		for($icounter=0;$icounter<$size;$icounter++){

			$discount_price =($HotelList_arr[$icounter]['highRate']-$HotelList_arr[$icounter]['lowRate']);
			
			
			$ValueAddsData =$HotelList_arr[$icounter]['RoomRateDetailsList']['RoomRateDetails']['ValueAdds']['ValueAdd'];
			if(!isset($ValueAddsData[0])){
			  $ValueAdds_arr[0]=$ValueAddsData;	
			}else{
				$ValueAdds_arr=$ValueAddsData;
			}
			
			$vaid_arr =array();
			foreach($ValueAdds_arr as $valuadd){
			  $vaid_arr[]=$valuadd['description'];
			}
			$vaid_str =@implode(",",$vaid_arr);	  
			 
			$promoDescription =$HotelList_arr[$icounter]['RoomRateDetailsList']['RoomRateDetails']['RateInfos']['RateInfo']['promoDescription'];
			 
		
			 
			 $SQL = "insert into search_results_ean set EANHotelID='".$HotelList_arr[$icounter]['hotelId']."', Name='".addslashes($HotelList_arr[$icounter]['name'])."', address1='".$HotelList_arr[$icounter]['address1']."', city='".$HotelList_arr[$icounter]['city']."', postalCode='".$HotelList_arr[$icounter]['postalCode']."', countryCode='".$HotelList_arr[$icounter]['countryCode']."', propertyCategory='".$HotelList_arr[$icounter]['propertyCategory']."', hotelRating='".$HotelList_arr[$icounter]['hotelRating']."', hotelRatingDisplay='".$HotelList_arr[$icounter]['hotelRatingDisplay']."', confidenceRating='".$HotelList_arr[$icounter]['confidenceRating']."', amenityMask='".$HotelList_arr[$icounter]['amenityMask']."', tripAdvisorRating='".$HotelList_arr[$icounter]['tripAdvisorRating']."', tripAdvisorReviewCount='".$HotelList_arr[$icounter]['tripAdvisorReviewCount']."', tripAdvisorRatingUrl='".$HotelList_arr[$icounter]['tripAdvisorRatingUrl']."', promoDescription='".$promoDescription."', locationDescription='".$HotelList_arr[$icounter]['locationDescription']."', shortDescription='".$HotelList_arr[$icounter]['shortDescription']."', highRate='".$HotelList_arr[$icounter]['highRate']."', lowRate='".$HotelList_arr[$icounter]['lowRate']."', discount_price='".$discount_price."', rateCurrencyCode='".$HotelList_arr[$icounter]['rateCurrencyCode']."', latitude='".$HotelList_arr[$icounter]['latitude']."', longitude='".$HotelList_arr[$icounter]['longitude']."', proximityDistance='".$HotelList_arr[$icounter]['proximityDistance']."', proximityUnit='".$HotelList_arr[$icounter]['proximityUnit']."', hotelInDestination='".$HotelList_arr[$icounter]['hotelInDestination']."', thumbNailUrl='".$HotelList_arr[$icounter]['thumbNailUrl']."',desti_lat_lon='".$desti_lat_lon."',valueAdds='".$vaid_str."', date_time='".date("Y-m-d")."', checkin='".$checkIn_db."', checkout='".$checkOut_db."', currency='".$_SESSION['Cri_currency']."',language='".$_SESSION['Cri_language']."', search_session='".$search_Session_Id."', Cri_Adults='', sort_order='".$sort_order."'"; 
		  
			
			
			$wpdb->query($SQL);
		     $sort_order++;
	 }
	
	// controller query
	if($pageCount >0){
      getPagingResults($actionUrl,$cacheKey,$cacheLocation,$moreResultsAvailable,$pageCount,$search_Session_Id,$desti_lat_lon,$checkIn,$checkOut,$_SESSION['Cri_currency'],$_SESSION['Cri_language'],$Cri_Adults,$activePropertyCount);
    }
	/*== Add custom hotel ==*/	
	update_custom_hotels($lat,$lon,$desti_lat_lon,$checkIn_db,$checkOut_db,$search_Session_Id,$sort_order);

	// controller
	$moreQuery =" and currency='".$_SESSION['Cri_currency']."' and language='".$_SESSION['Cri_language']."' and LowRate>0";
	if(($_REQUEST['hotelType']!='') && ($_REQUEST['hotelType']!=1) ){
		$moreQuery=' and propertyCategory='.$_REQUEST['hotelType'];
	}
	echo getControlsData($search_Session_Id,$moreQuery,$activePropertyCount);
 
}



function getPagingResults($actionUrl,$cacheKey,$cacheLocation,$moreResultsAvailable,$pageCount,$search_Session_Id,$desti_lat_lon,$checkIn,$checkOut,$Cri_currency,$Cri_language,$Cri_Adults,$activePropertyCount){
	
	global $wpdb;
	global $Param;
	
   $cacheKey_new =$cacheKey;
   $cacheLocation_new =$cacheLocation;
   $moreData =$moreResultsAvailable;
   
   $checkIn_db =date('Y-m-d',strtotime($checkIn));
   $checkOut_db =date('Y-m-d',strtotime($checkOut));
   
   if($moreData==1)
   {
	   for($i=0;$i<$pageCount;$i++){
		$ext_param ='&cacheKey='.$cacheKey_new.'&cacheLocation='.$cacheLocation_new;
		
		$URL = $actionUrl.'?action=getPagingResults&'.$Param.$ext_param; 
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $URL);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		$results = curl_exec($ch);
		curl_close ($ch);
		
		$Response_Arr =json_decode($results, true);
		
		$HotelListResponse =$Response_Arr['HotelListResponse'];
		$customerSessionId =$HotelListResponse['customerSessionId'];
		$cacheLocation_new =$HotelListResponse['cacheLocation'];
		$cacheKey_new =$HotelListResponse['cacheKey'];
		$moreData =$HotelListResponse['moreResultsAvailable'];
		$HotelList =$HotelListResponse['HotelList'];
		$size = $HotelList['@size'];
		if($size >1){
			$HotelList_arr =$HotelList['HotelSummary'];
		}else{
			$HotelList_arr[0] =$HotelList['HotelSummary'];
		}
		
		for($icounter=0;$icounter<$size;$icounter++){
			$discount_price =($HotelList_arr[$icounter]['highRate']-$HotelList_arr[$icounter]['lowRate']);
			$ValueAddsData =$HotelList_arr[$icounter]['RoomRateDetailsList']['RoomRateDetails']['ValueAdds']['ValueAdd'];
			if(!isset($ValueAddsData[0])){
			  $ValueAdds_arr[0]=$ValueAddsData;	
			}else{
				$ValueAdds_arr=$ValueAddsData;
			}
			
			$vaid_arr =array();
			foreach($ValueAdds_arr as $valuadd){
			  $vaid_arr[]=$valuadd['description'];
			}
			$vaid_str =@implode(",",$vaid_arr);	  
			
			$promoDescription =$HotelList_arr[$icounter]['RoomRateDetailsList']['RoomRateDetails']['RateInfos']['RateInfo']['promoDescription'];
			 
			$SQL = "insert into search_results_ean set EANHotelID='".$HotelList_arr[$icounter]['hotelId']."', Name='".addslashes($HotelList_arr[$icounter]['name'])."', address1='".$HotelList_arr[$icounter]['address1']."', city='".$HotelList_arr[$icounter]['city']."', postalCode='".$HotelList_arr[$icounter]['postalCode']."', countryCode='".$HotelList_arr[$icounter]['countryCode']."', propertyCategory='".$HotelList_arr[$icounter]['propertyCategory']."', hotelRating='".$HotelList_arr[$icounter]['hotelRating']."', hotelRatingDisplay='".$HotelList_arr[$icounter]['hotelRatingDisplay']."', confidenceRating='".$HotelList_arr[$icounter]['confidenceRating']."', amenityMask='".$HotelList_arr[$icounter]['amenityMask']."', tripAdvisorRating='".$HotelList_arr[$icounter]['tripAdvisorRating']."', tripAdvisorReviewCount='".$HotelList_arr[$icounter]['tripAdvisorReviewCount']."', tripAdvisorRatingUrl='".$HotelList_arr[$icounter]['tripAdvisorRatingUrl']."', promoDescription='".$promoDescription."',  locationDescription='".$HotelList_arr[$icounter]['locationDescription']."', shortDescription='".$HotelList_arr[$icounter]['shortDescription']."', highRate='".$HotelList_arr[$icounter]['highRate']."', lowRate='".$HotelList_arr[$icounter]['lowRate']."', discount_price='".$discount_price."', rateCurrencyCode='".$HotelList_arr[$icounter]['rateCurrencyCode']."', latitude='".$HotelList_arr[$icounter]['latitude']."', longitude='".$HotelList_arr[$icounter]['longitude']."', proximityDistance='".$HotelList_arr[$icounter]['proximityDistance']."', proximityUnit='".$HotelList_arr[$icounter]['proximityUnit']."', hotelInDestination='".$HotelList_arr[$icounter]['hotelInDestination']."', thumbNailUrl='".$HotelList_arr[$icounter]['thumbNailUrl']."',desti_lat_lon='".$desti_lat_lon."',valueAdds='".$vaid_str."', date_time='".date("Y-m-d")."', checkin='".$checkIn_db."', checkout='".$checkOut_db."', currency='".$Cri_currency."', language='".$Cri_language."', search_session='".$search_Session_Id."', Cri_Adults='".$Cri_Adults."', sort_order='".$sort_order."'"; 
			 
			 $wpdb->query($SQL);
			 $sort_order++;
			} 
			
			
	  }
    }// is more avilable
	
	
	/*
	$moreQuery =" and currency='".$_SESSION['Cri_currency']."' and LowRate>0";
	if($_REQUEST['hotelType']!=''){
		$moreQuery=' and propertyCategory='.$_REQUEST['hotelType'];
	}
	echo getControlsData($search_Session_Id,$moreQuery,$activePropertyCount);
	*/
}


function getControlsData($search_Session_Id,$moreQuery,$activePropertyCount){
	global $wpdb;
	
	$sql ="SELECT count(Eanhotelid) as totalrecords, 
	(select count(Eanhotelid) from search_results_ean where hotelRating IN(4.5,5) and search_session='".$search_Session_Id."' ".$moreQuery.")  as stars5, 
	(select count(Eanhotelid) from search_results_ean where hotelRating IN(3.5,4) and search_session='".$search_Session_Id."' ".$moreQuery.") as stars4, 
	(select count(Eanhotelid) from search_results_ean where hotelRating IN(2.5,3) and search_session='".$search_Session_Id."' ".$moreQuery.")  as stars3, 
	(select count(Eanhotelid) from search_results_ean where hotelRating IN(1.5,2)  and search_session='".$search_Session_Id."' ".$moreQuery.") as stars2, 
	(select count(Eanhotelid) from search_results_ean where hotelRating IN(1) and search_session='".$search_Session_Id."' ".$moreQuery.")  as stars1, 
	(select count(Eanhotelid) from search_results_ean where hotelRating IN(0) and search_session='".$search_Session_Id."' ".$moreQuery.")  as stars0,
	(select count(Eanhotelid) from search_results_ean where proximityDistance<=2 and search_session='".$search_Session_Id."' ".$moreQuery.")  as distance2,
  (select count(Eanhotelid) from search_results_ean where proximityDistance<=5 and search_session='".$search_Session_Id."' ".$moreQuery.")  as distance5,
  (select count(Eanhotelid) from search_results_ean where proximityDistance<=10 and search_session='".$search_Session_Id."' ".$moreQuery.")  as distance10,
  (select count(Eanhotelid) from search_results_ean where proximityDistance<=20 and search_session='".$search_Session_Id."' ".$moreQuery.") as distance20,
  (select count(Eanhotelid) from search_results_ean where proximityDistance<=50 and search_session='".$search_Session_Id."' ".$moreQuery.")  as distance50,
	
	(select min(lowrate) from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery.")  as minrate , 
	(select max(lowrate) as maxrate from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery.")  as maxrate,
	(select MIN(tripAdvisorRating) from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery.")  as minguest,
	(select MAX(tripAdvisorRating) from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery.") as maxguest FROM search_results_ean where search_session='".$search_Session_Id."'";
  
  $resutls = $wpdb->get_results($sql); 
  $obj = $resutls[0];
  
  
  $data =array('totalrecords'=>$obj->totalrecords,'stars5'=>$obj->stars5,'stars4'=>$obj->stars4,'stars3'=>$obj->stars3,'stars2'=>$obj->stars2,'stars1'=>$obj->stars1,'stars0'=>$obj->stars0,'distance2'=>$obj->distance2,'distance5'=>$obj->distance5,'distance10'=>$obj->distance10,'distance20'=>$obj->distance20,'distance50'=>$obj->distance50,'minrate'=>floor($obj->minrate),'maxrate'=>ceil($obj->maxrate),'minguest'=>$obj->minguest,'maxguest'=>$obj->maxguest, 'activePropertyCount'=>$activePropertyCount);
  return json_encode($data);
	
}


if($_REQUEST["action"]=="getControls"){
	$moreQuery =" and currency ='".$_SESSION['Cri_currency']."' and language='".$_SESSION['Cri_language']."' and LowRate>0";
	if(($_REQUEST['hotelType']!='') && ($_REQUEST['hotelType']!=1) ){
		$moreQuery.=' and propertyCategory='.$_REQUEST['hotelType'];
	}
	
	//3675659
	$sql =mysql_query("select MIN(LowRate) as min_price,Max(LowRate) as max_price,MIN(guestRating) as min_guest,MAX(guestRating) as max_guest, count(*) as total_hotel from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery." ");
	$obj =mysql_fetch_object($sql);
	$data =array('min_price'=>$obj->min_price,'max_price'=>$obj->max_price,'min_guest'=>$obj->min_guest,'max_guest'=>$obj->max_guest,'total_hotel'=>$obj->total_hotel);
	
	echo json_encode($data);
}



if($_REQUEST["action"]=="getAmenities"){
	
	$moreQuery =" and currency ='".$_SESSION['Cri_currency']."' and language='".$_SESSION['Cri_language']."' and  LowRate>0";
	if(($_REQUEST['hotelType']!='') && ($_REQUEST['hotelType']!=1) ){
		$moreQuery.=' and propertyCategory='.$_REQUEST['hotelType'];
	}
	
	$results =$wpdb->get_results("select valueAdds from search_results_ean where search_session='".$search_Session_Id."' ".$moreQuery." ");
	$amenityStr='';
	foreach( $results as $obj){
		$amenityStr.=$obj->valueAdds.',';
	}
	$amenities =explode(',',$amenityStr);
	$amenityArr =array_filter(array_unique($amenities));
	
	echo json_encode($amenityArr);
}


if($_REQUEST["action"]=="Searched_Hotels"){

	$data = array();
   	
    $limit =15;
	if(($_REQUEST["page"]<=1) || ($_REQUEST["page"]=='')){
		$page = 0;
	}else{
		//$page = ( ($_REQUEST["page"]-1) * $limit) + 1;
		$page = ( ($_REQUEST["page"]-1) * $limit);
	}
	
	
	$moreCod =" and currency ='".$_SESSION['Cri_currency']."' and language='".$_SESSION['Cri_language']."' and  LowRate>0";
	
	if(($_REQUEST['hotelType']!='') && ($_REQUEST['hotelType']!=1) ){
		$moreCod =' and propertyCategory='.$_REQUEST['hotelType'];
	}
	
	
	//// Rating filter
	if(is_array($_REQUEST['Cri_Rating'])){ 
	   $Cri_Rating =$_REQUEST['Cri_Rating'];
     }else{
	   if($_REQUEST['Cri_Rating']!=''){
	    $Cri_Rating[0]=$_REQUEST['Cri_Rating'];
	   }
    }
	
	if(count($Cri_Rating)>0)
	{
		$moreCod.= ' and ';
		$star_fix_arr =array("5"=>array('5','4.5'),
						 "4"=>array('4','3.5'),
						 "3"=>array('3','2.5'),
						 "2"=>array('2','1.5'),
						 "1"=>array('1'),
						 "0"=>array('0')
						);
		$star_str ='';
		foreach($Cri_Rating as $val){
			$val_arr =$star_fix_arr[$val];
			foreach($val_arr as $v){
				$star_str.=$v.',';
			}
		}
		$star_str =substr($star_str,0,-1);
		$moreCod.='hotelRating IN('.$star_str.')';
	}
	//// Price filter
	
	
	if($_REQUEST['Cri_Price']!=''){
	   $Cri_PriceArr=explode("-",$_REQUEST['Cri_Price']);
	   $moreCod.= " and ( LowRate BETWEEN '".$Cri_PriceArr[0]."' and '".$Cri_PriceArr[1]."' ) ";
     }
	
	
	//// Distance filter
	if(($_REQUEST['Cri_Distance']!='') && ($_REQUEST['Cri_Distance']>0)){
		$dExp =explode('-',$_REQUEST['Cri_Distance']);
		//$moreCod.= ' and (ROUND(proximityDistance)>='.$dExp[0].' and ROUND(proximityDistance)<='.$dExp[1].') ';
		$moreCod.= ' and proximityDistance <='.$_REQUEST['Cri_Distance'].'';
		
	}
	
	
	if( ($_REQUEST['Cri_guestrating']!='') && ($_REQUEST['Cri_guestrating']!='NaN-NaN')){
		 $dExp =explode('-',$_REQUEST['Cri_guestrating']);
		 $moreCod.= ' and (tripAdvisorRating >='.($dExp[0]).' and tripAdvisorRating <='.($dExp[1]).') ';
	}
	
	//// Filter by type
	if(is_array($_REQUEST['Cri_Type'])){ 
	   $Cri_Type =$_REQUEST['Cri_Type'];
     }else{
	   if($_REQUEST['Cri_Type']!=''){
	    $Cri_Type[0]=$_REQUEST['Cri_Type'];
	   }
    }
	if(count($Cri_Type)>0){
		$CriType =@implode(',',$Cri_Type);
		$moreCod.= ' and propertyCategory IN('.$CriType.')';
	}
    
    //// Filter by Amenityies
	
	if( ($_REQUEST['Cri_amenity']!='undefined') || ($_REQUEST['Cri_amenity']!='')){ 
	   $Cri_amenity =explode(",",$_REQUEST['Cri_amenity']);
     }
	
	//print_r($Cri_amenity);
	
	if(count($Cri_amenity)>0){
		$a=0;
		$moreCod.= " and (";
		foreach($Cri_amenity as $val){
			 $moreCod.= " valueAdds like '%".$val."%'";
		     if($a<count($Cri_amenity)-1){ $moreCod.= " OR ";}	 
	     $a++;		 
		}	
		 $moreCod.= " ) ";
	}		
	
	
	
	
	/// Orderby
	$orderBy='';
	
	if($_REQUEST['orderby_fild']=='recommended'){
		//$orderBy =' order by sort_order '.$orderby_val;
		$orderBy =' order by is_custom DESC';
	}
	elseif($_REQUEST['orderby_fild']=='price'){
		$orderBy =' order by LowRate '.$orderby_val;
	}
	elseif($_REQUEST['orderby_fild']=='hotelRating'){
		$orderBy =' order by hotelRating '.$orderby_val;
	}
	elseif($_REQUEST['orderby_fild']=='tripAdvisorRating'){
		$orderBy =' order by tripAdvisorRating '.$orderby_val;
	}
	elseif($_REQUEST['orderby_fild']=='discounts'){
		$orderBy =' order by discount_price '.$orderby_val;
	}
	
	else{
		$orderBy =' order by sort_order ASC';
	}
   
    if($_REQUEST['hotel_name']!=''){
	   $Sqls = "select * from search_results_ean where destination_id='".$location_Id."' and Name='".trim($_REQUEST['hotel_name'])."' and currency='".$_SESSION["Cri_currency"]."' and language='".$_SESSION['Cri_language']."' and search_session='".trim($search_Session_Id)."' and LowRate>0  LIMIT 0,1"; 
	 }else{
	  
	    if($_REQUEST['list_Or_Map_Control']=='map'){
			$Sqls = "select EANHotelID,Name,lowRate,latitude,longitude from search_results_ean where search_session='".trim($search_Session_Id)."' and LowRate>0 ".$moreCod." ".$orderBy." "; 
		}else{
           $Sqls = "select EANHotelID,Name,hotelRating,confidenceRating,address1,lowRate,highRate,discount_price,latitude,longitude, thumbNailUrl,is_custom, tripAdvisorRatingUrl,promoDescription from search_results_ean where search_session='".trim($search_Session_Id)."' and LowRate>0 ".$moreCod." ".$orderBy." LIMIT ".$page.", $limit"; 
		}
	 
	    $Sqqls = "select count(EANHotelID) as totalCount from search_results_ean where search_session='".trim($search_Session_Id)."' and LowRate>0 ".$moreCod." ".$orderBy.""; 
		
	 }
	 
	//echo $Sqls; die; 
	$totalResutls =$wpdb->get_results($Sqqls);
	$totalObjs =$totalResutls[0];
	
	$results = $wpdb->get_results($Sqls);

	if($_REQUEST['list_Or_Map_Control']=='map'){
		foreach ($results as $Objs ){
		 $data['result'][] =array('total'=>$totalObjs->totalCount,'hotelId'=>$Objs->EANHotelID,'name'=>stripslashes($Objs->Name),'lowRate'=>number_format($Objs->lowRate, 2),'latitude'=>$Objs->latitude,'longitude'=>$Objs->longitude);
		}
	}
	else{
		foreach ($results as $Objs ){
			if($Objs->promoDescription!=''){
				$promoDescription=$Objs->promoDescription;
			}else{
				$promoDescription='';
			}
			$isFavourate='';
			if( ($_SESSION['userID']!='') && ($_SESSION['userID']>0) ){
			  $favResults =$wpdb->get_results("select * from favourite where EANHotelID='".$Objs->EANHotelID."' and user_id='".$_SESSION['userID']."'");
			  if(count($favResults) >0){
				  $isFavourate='Yes';
			  }
			}
			$tripAdvisorRatingUrl=str_replace("http", "https", $Objs->tripAdvisorRatingUrl);
			
			$data['result'][] =array('total'=>$totalObjs->totalCount,'hotelId'=>$Objs->EANHotelID,'name'=>stripslashes($Objs->Name),'thumbNailUrl'=>stripslashes($Objs->thumbNailUrl),'hotelRating'=>stripslashes(round($Objs->hotelRating)),'popularity'=>stripslashes($Objs->confidenceRating),'tripAdvisorRatingUrl'=>str_replace("http:","",stripslashes($tripAdvisorRatingUrl)),'address1'=>stripslashes($Objs->address1), 'lowRate'=>number_format($Objs->lowRate, 2),'highRate'=>number_format($Objs->highRate, 2),'discount_price'=>$Objs->discount_price,'latitude'=>$Objs->latitude,'longitude'=>$Objs->longitude,'promoDescription'=>$promoDescription,'is_custom'=>$Objs->is_custom,'isFavourate'=>$isFavourate);
		}
	}
	
	
	$datastr = json_encode($data);

	echo $datastr;
	die;
}



if($_REQUEST["action"]=="Hotel_Description"){ 
   

    if($_REQUEST['is_custom']==1){
		
	   $PostID =$_REQUEST["hotel_id"];
	   $Post =get_post($PostID);
	   $title =$Post->post_title;
	   $description =$Post->post_content;
	   $image = wp_get_attachment_image_src( get_post_thumbnail_id( $PostID ), 'single-post-thumbnail' );
	   $feature_image =$image[0];
	   
	   $postMeta = get_post_meta($PostID);
	   
	  
	   $RoomType =json_decode($postMeta['roomData'][0],true);
	   $countRoom =count($RoomType['name']);
	   $roomData =array();
	   for($i=0;$i<$countRoom;$i++){
		 $roomData[] =array('roomTypeId'=>$i,
		                    'roomTypeId'=>$i,
                            'description'=>$RoomType['name'][$i],
                            'descriptionLong'=>$RoomType['name'][$i],
                            'promo_description'=>$RoomType['description'][$i],
							'average_price'=>$RoomType['average_price'][$i],
							'sale_price'=>$RoomType['sale_price'][$i],
							'checkinInstruction'=>$RoomType['checkinInstruction'][$i],
							'specialcheckinInstruction'=>$RoomType['specialcheckinInstruction'][$i],
							'cancellationPolicy'=>$RoomType['cancellationPolicy'][$i],
							'roomAmenities'=>$RoomType['amenty'][$i]
		                    );  
	   }
	   
	   
	   $ameneties =explode(",",$postMeta['amenty'][0]);
	   $a=0;
	   $amenetyData =array();
	  foreach($ameneties as $val){
		$amenetyData[]=array('amenityId'=>$a,'amenity'=>$val) ;
		$a++;
	  } 
	   
	   $destination_Arr =explode(",",$postMeta['destination'][0]);
	   $country =$destination_Arr[count($destination_Arr)-1];
	   
	   $HotelImages[] =array('hotelImageId'=> '','name' => '','url' => $feature_image,'thumbnailUrl' =>$feature_image );
	   
	   $multi_img_array =explode(",",$postMeta['_multi_img_array'][0]);
	   foreach($multi_img_array as $val){
		 $gResults =$wpdb->get_results("select guid from ".$wpdb->prefix ."posts where ID =".$val."");
		 $gResult =$gResults[0];
		 if($gResult->guid!=''){
		 $HotelImages[] = array('hotelImageId'=> '','name' => '','url' => $gResult->guid,'thumbnailUrl' =>$gResult->guid );
		 }
	     
	   }
	   $data['HotelInformationResponse'] = array('hotelId'=>$PostID,
	                                            'customerSessionId'=>'',
                                                'HotelSummary'=>array('order'=>0,
												                      'hotelId'=>$PostID,
																	  'name'=>$title,
																	  'address1'=>$postMeta['hotel_address'][0],
																	  'address2'=>'',
																	  'city'=>$postMeta['destination'][0],
																	  'postalCode'=>'',
																	  'countryCode'=>$country,
																	  'propertyCategory'=>'1',
																	  'hotelRating'=>$postMeta['hotel_rating'][0],
																	  'hotelRatingDisplay'=>'Star',
																	  'tripAdvisorRating'=>$postMeta['tripAdvisor_rating'][0],
																	  'tripAdvisorReviewCount'=>$postMeta['tripadvisor_reviews_count'][0],
																	  'tripAdvisorRatingUrl'=>'//www.tripadvisor.com/img/cdsi/img2/ratings/traveler/'.$postMeta['tripAdvisor_rating'][0].'-123456-4.gif',
																     'tripAdvisorReviewPageUrl'=>$postMeta['tripadvisor_link'][0],
																	  'locationDescription'=>'',
																	  'highRate'=>$postMeta['average_price'][0],
																	  'lowRate'=>$postMeta['sale_price'][0],
																	  'latitude'=>$postMeta['hotel_latitude'][0],
																	  'longitude'=>$postMeta['hotel_longitude'][0] 
																	  ),
																	  
												'HotelDetails'=>array('numberOfRooms'=>0,
												                      'numberOfFloors'=>1,
																	  'checkInTime'=>'',
																	  'checkOutTime'=>'',
																	  'propertyInformation'=>'',
																	  'areaInformation'=>'',
																	  'propertyDescription'=>'',
																	  'hotelPolicy'=>'',
																	  'roomInformation'=>'',
																	  'checkInInstructions'=>'',
																	  'knowBeforeYouGoDescription'=>'',
																	  'roomFeesDescription'=>'',
																	  'locationDescription'=>'',
																	  'diningDescription'=>'',
																	  'businessAmenitiesDescription'=>'',
																	  'roomDetailDescription'=>$description),
												'Suppliers'=>array(),
												'RoomTypes'=>array('size'=>count($roomData),
												                  'RoomType'=>$roomData
												                  ),
												'PropertyAmenities'=>array('size'=>count($amenetyData),
												                           'PropertyAmenity'=>$amenetyData 
												                           ),
												'HotelImages'=>array('size'=>count($HotelImages),
												                     'HotelImage'=>$HotelImages,
												                     )
	                                            );
	 $contents =json_encode($data);
	}
	else{
    $ext_param ='&hotel_id='.$_REQUEST["hotel_id"];
	$URL = $actionUrl.'?action=Hotel_Description&'.$Param.$ext_param; 
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $URL);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	$contents = curl_exec($ch);
	curl_close ($ch);
	$contents =str_replace("@","",$contents);
	$contents =str_replace("http:","",$contents);
	}
	//echo "<pre>";
	//print_r(json_decode($contents));
	print_r($contents);
}

if($_REQUEST["action"]=="RoomAvailability"){
  
    $_SESSION['checkIn']=$_REQUEST['checkIn'];
    $_SESSION['checkOut']=$_REQUEST['checkOut'];
    $_SESSION['no_of_rooms']=$_REQUEST['rooms'];
  
    $adults =explode(",",$_REQUEST['adults']);
	$childs =explode(",",$_REQUEST['childs']);
	$ageStr =$_REQUEST['childAge'];
	
	$childAge ='';
	if($ageStr!=''){
		$ageArr =explode("-",$_REQUEST['childAge']);
		for($c=0;$c<count($ageArr);$c++){
			$ageArr2 =explode("_",$ageArr[$c]);
			$key=$ageArr2[0];
			$val=explode(",",$ageArr2[1]);
			$childAge[$key]=$val;
		}
	}
	
   $_SESSION['Cri_Pacs'] = array('adults'=>$adults,
							    'childs'=>$childs,
							    'childAge'=>$childAge
							 );

    
	if($_REQUEST['is_custom']==1){
	   $PostID =$_REQUEST["hotel_id"];
	   $Post =get_post($PostID);
	   $title =$Post->post_title;
	   $description =$Post->post_content;
	   $image = wp_get_attachment_image_src( get_post_thumbnail_id( $PostID ), 'single-post-thumbnail' );
	   $feature_image =$image[0];
	   
	   $postMeta = get_post_meta($PostID);
	   $destination_Arr =explode(",",$postMeta['destination'][0]);
	   $country =$destination_Arr[count($destination_Arr)-1];
	   
	   $RoomType =json_decode($postMeta['roomData'][0],true);
	   $countRoom =count($RoomType['name']);
	 
	   $roomData =array();
	   for($i=0;$i<$countRoom;$i++){
		  $ameneties =$RoomType['amenty'][$i];
		  $amenetyData ='';
          $a=0;		  
          foreach($ameneties as $val){
			$amenetyData[]=array('amenityId'=>$a,'amenity'=>$val) ;
			$a++;
		  }   
		  $room_images =get_post_meta($PostID, 'room_images_'.$i, true );
		  $imgUrl =get_template_directory_uri().'/roomImages/'.$room_images;
		 
		   
		 $roomData[] =array('rateCode'=>$i,
                            'rateDescription'=>$RoomType['name'][$i],
							'descriptionLong' =>$RoomType['name'][$i],
							'promo_description'=>$RoomType['description'][$i],
							'averageBaseRate'=>$RoomType['average_price'][$i],
							'averageRate'=>$RoomType['sale_price'][$i],
							'checkInInstructions'=>$RoomType['checkinInstruction'][$i],
							'specialCheckInInstructions'=>$RoomType['specialcheckinInstruction'][$i],
							'cancellationPolicy'=>$RoomType['cancellationPolicy'][$i],
							'roomAmenities'=>array('size'=>count($RoomType['amenty'][$i]),
												   'RoomAmenity' =>$amenetyData
													),
							'RoomImages'=>array('size'=>1,
												'RoomImage' =>$imgUrl
													)						
							
		                    );  
	   }
	   
		
		
		$data['HotelRoomAvailabilityResponse'] =array('size' => 1,
													  'customerSessionId' =>'',
													  'hotelId' =>$_REQUEST["hotel_id"],
													  'arrivalDate' => $_SESSION['checkIn'],
													  'departureDate' => $_SESSION['checkOut'],
													  'hotelName' => $title,
													  'hotelAddress' =>$postMeta['hotel_address'][0],
													  'hotelCity' => $postMeta['destination'][0],
													  'hotelCountry' =>$country,
													  'numberOfRoomsRequested' => 1,
													  'checkInInstructions' => '',
													  'HotelRoomResponse' =>$roomData
		                                              );
	$contents =json_encode($data);	
	}
	else{
	$ext_param ='&hotel_id='.$_REQUEST["hotel_id"].'&checkIn='.$_SESSION['checkIn'].'&checkOut='.$_SESSION['checkOut'].'&no_of_rooms='.$_SESSION['no_of_rooms'].'&Cri_Pacs='.json_encode($_SESSION['Cri_Pacs']);
	
	$URL = $actionUrl.'?action=RoomAvailability&'.$Param.$ext_param; 
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $URL);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	$contents = curl_exec($ch);
	curl_close ($ch);
	$contents =str_replace("@","",$contents);
	$contents =str_replace("http:","",$contents);
	}
	print_r($contents);
	
}



if($_REQUEST["action"]=="Show_Room_Info"){ 
    if($_REQUEST['is_custom']==1){
	   $checkIn =$_SESSION['checkIn'];
       $checkOut =$_SESSION['checkOut'];
	   $nights = floor((strtotime($checkOut) - strtotime($checkIn))/(60*60*24));
		
	   $PostID =$_REQUEST["hotel_id"];
	   $Post =get_post($PostID);
	  
	   $title =$Post->post_title;
	   $description =$Post->post_content;
	   $image = wp_get_attachment_image_src( get_post_thumbnail_id( $PostID ), 'single-post-thumbnail' );
	   $feature_image =$image[0];
	   
	   $postMeta = get_post_meta($PostID);
	   $destination_Arr =explode(",",$postMeta['destination'][0]);
	   $country =$destination_Arr[count($destination_Arr)-1];
	   
	   $RoomType =json_decode($postMeta['roomData'][0],true);
	   $countRoom =count($RoomType['name']); //custom hotel added number of rooms.
	   $roomData =array();
	   
	   for($i=0;$i<$countRoom;$i++){
		  $ameneties =$RoomType['amenty'][$i];
		  $amenetyData ='';
          $a=0;		  
          foreach($ameneties as $val){
			$amenetyData[]=array('amenityId'=>$a,'amenity'=>$val) ;
			$a++;
		  }   
		   
		 $sale_price = $RoomType['sale_price'][$i];
		 $nightlyRateTotal =0;
		 $Tax_and_service_fee=0;
		 for($n=0;$n<$_SESSION['no_of_rooms'];$n++){
		    $nightlyRateTotal= ($nightlyRateTotal+$sale_price);
			$Taxservice_fee=($RoomType['tax'][$i]+$RoomType['service_charge'][$i]);
			$Tax_and_service_fee =($Tax_and_service_fee+$Taxservice_fee);
	     }
		 
		 $nightlyRateTotal =($nightlyRateTotal*$nights);
		 $Tax_and_service_fee =($Tax_and_service_fee*$nights);
		 
		 $TotalchargeableRate =($nightlyRateTotal+$Tax_and_service_fee);
		 
		 $roomData[] =array('rateCode'=>$i,
                            'rateDescription'=>$RoomType['name'][$i],
							'description' =>$RoomType['name'][$i],
							'descriptionLong' =>$RoomType['name'][$i],
							'promo_description'=>$RoomType['description'][$i],
							'averageBaseRate'=>$RoomType['average_price'][$i],
							'averageRate'=>$sale_price,
							'nightlyRateTotal'=>$nightlyRateTotal,
							'Tax_and_service_fee' =>$Tax_and_service_fee,
							'TotalchargeableRate'=>$TotalchargeableRate,
							
							'checkInInstructions'=>$RoomType['checkinInstruction'][$i],
							'specialCheckInInstructions'=>$RoomType['specialcheckinInstruction'][$i],
							'cancellationPolicy'=>$RoomType['cancellationPolicy'][$i],
							'roomAmenities'=>array('size'=>count($RoomType['amenty'][$i]),
												   'RoomAmenity' =>$amenetyData
													)
							
		                    );  
	   }
	   
	   $data['HotelRoomAvailabilityResponse']=array('size'=>'',
	                                                'customerSessionId'=>'',
													'hotelId'=>$_REQUEST["hotel_id"],
													'arrivalDate'=>$_SESSION['checkIn'],
													'departureDate'=>$_SESSION['checkOut'],
													'hotelName'=>$title,
													'hotelAddress'=>$postMeta['hotel_address'][0],
													'hotelCity'=>$postMeta['destination'][0],
													'hotelCountry'=>$country ,
													'numberOfRoomsRequested'=>$_SESSION['no_of_rooms'],
													'checkInInstructions'=>'',
													'HotelRoomResponse'=>$roomData
	                                                );
	 $contents =json_encode($data);	
	}else{
	$ext_param ='&hotel_id='.$_REQUEST["hotel_id"].'&checkIn='.$_SESSION['checkIn'].'&checkOut='.$_SESSION['checkOut'].'&no_of_rooms='.$_SESSION['no_of_rooms'].'&Cri_Pacs='.json_encode($_SESSION['Cri_Pacs']);
	
	$URL = $actionUrl.'?action=RoomAvailability&'.$Param.$ext_param; 
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $URL);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	$contents = curl_exec($ch);
	curl_close ($ch);
	$contents =str_replace("@","",$contents);
	$contents =str_replace("http:","",$contents);
	}
	//echo "<pre>";
	//print_r(json_decode($contents));
	print_r($contents);
	
}


if($_REQUEST["action"]=="Show_Hotel_Suggestions"){
	
	$Sqls = "select EANHotelID,Name,lowRate,tripAdvisorRatingUrl,thumbNailUrl from search_results_ean where EANHotelID !='".trim($_REQUEST["hotel_id"])."'  and desti_lat_lon=(select desti_lat_lon from search_results_ean where EANHotelID='".trim($_REQUEST["hotel_id"])."' LIMIT 0, 1) and hotelRating=(select hotelRating from search_results_ean where EANHotelID='".trim($_REQUEST["hotel_id"])."' LIMIT 0, 1) and search_session=(select search_session from search_results_ean where EANHotelID='".trim($_REQUEST["hotel_id"])."' LIMIT 0, 1) LIMIT 0, 3";
	
	$results = $wpdb->get_results($Sqls);
	$tripAdvisorRatingUrl=str_replace("http", "https", $Objs->tripAdvisorRatingUrl);
	foreach($results as $Objs){
		$data['result'][] =array('EANHotelID'=>$Objs->EANHotelID,'name'=>stripslashes($Objs->Name),'thumbNailUrl'=>stripslashes(str_replace("_t.jpg", "_b.jpg", $Objs->thumbNailUrl)),'tripAdvisorRatingUrl'=>stripslashes($tripAdvisorRatingUrl), 'lowRate'=>number_format($Objs->lowRate, 2));
	}
	$datastr = json_encode($data);
	echo $datastr;
	die;
}



if($_REQUEST["action"]=="HotelPaymentRequest"){
	
	$ext_param ='&hotel_id='.$_REQUEST["hotel_id"].'&supplierType='.$_SESSION['supplierType'];
	
	$URL = $actionUrl.'?action=HotelPaymentRequest&'.$Param.$ext_param; 
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $URL);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	$contents = curl_exec($ch);
	curl_close ($ch);
	print_r($contents);
}

if($_REQUEST["action"]=="Confirmation"){
	$itineraryId =trim($_REQUEST['itineraryId']);
	$sql ="select * from twc_booking where itineraryId='".$itineraryId."'";
	$results =$wpdb->get_results($sql);
	$Obj=$results[0];
	
	if($Obj->is_custom==1){
	  $response = json_decode(str_replace("@","",$Obj->response_xml));
	  $HotelRoomReservationResponse =$response->HotelRoomReservationResponse;
     $is_custom=1;	 
	}else{
	$response= json_decode(str_replace("@","",$Obj->response_xml));
	$HotelRoomReservationResponse =$response->HotelRoomReservationResponse;
	$is_custom=0;	 
	}
	$data =array('is_custom'=>$is_custom,'itineraryId'=>$Obj->itineraryId,'confirmationNumbers'=>$Obj->confirmationNumbers,'booking_status'=>$Obj->booking_status,'hotelName'=>$Obj->hotelName,'hotelRating'=>$Obj->hotelRating,'hotel_img'=>$Obj->hotel_img,'hotelAddress'=>$Obj->hotelAddress,'hotelCity'=>$Obj->hotelCity,'hotelCountryCode'=>$Obj->hotelCountryCode,'user_name'=>$Obj->user_name,'user_email'=>$Obj->user_email,'user_contactno'=>$Obj->user_contactno,'check_in'=>$Obj->check_in,'check_out'=>$Obj->check_out,'chargable_rate'=>$Obj->chargable_rate,'currency_code'=>$Obj->currency_code,'bookingResponse'=>$HotelRoomReservationResponse);
	echo json_encode($data);
}


if($_REQUEST["action"]=="BestOfferdHotels"){
	
	$Sqls = "select EANHotelID,Name,lowRate,highRate,hotelRating,discount_price,confidenceRating,address1,tripAdvisorRatingUrl,thumbNailUrl from search_results_ean where search_session='".trim($_REQUEST['search_Session_Id'])."' and hotelRating >3 order by discount_price DESC   LIMIT 0, 10";
	$results = $wpdb->get_results($Sqls);
	
	foreach($results as $Objs){
		$data['result'][] =array('hotelId'=>$Objs->EANHotelID,'name'=>stripslashes($Objs->Name),'thumbNailUrl'=>str_replace("_t","_y",stripslashes($Objs->thumbNailUrl)),'hotelRating'=>stripslashes(round($Objs->hotelRating)),'popularity'=>stripslashes($Objs->confidenceRating),'tripAdvisorRatingUrl'=>str_replace("http:","",stripslashes($Objs->tripAdvisorRatingUrl)),'address1'=>stripslashes($Objs->address1), 'lowRate'=>number_format($Objs->lowRate, 2),'highRate'=>number_format($Objs->highRate, 2),'discount_price'=>$Objs->discount_price);
	}
	$datastr = json_encode($data);
	echo $datastr;
	die;
}

if($_REQUEST["action"]=="BestSellingHotels"){
	
	$Sqls = "select EANHotelID,Name,lowRate,highRate,hotelRating,discount_price,confidenceRating,address1,tripAdvisorRatingUrl,thumbNailUrl from search_results_ean where search_session='".trim($_REQUEST['search_Session_Id'])."' and hotelRating >2 order by hotelRating ASC   LIMIT 0, 10";
	$results = $wpdb->get_results($Sqls);
	
	foreach($results as $Objs){
		$dt[] =array('hotelId'=>$Objs->EANHotelID,'name'=>stripslashes($Objs->Name),'thumbNailUrl'=>str_replace("_t","_b",stripslashes($Objs->thumbNailUrl)),'hotelRating'=>stripslashes(round($Objs->hotelRating)),'popularity'=>stripslashes($Objs->confidenceRating),'tripAdvisorRatingUrl'=>str_replace("http:","",stripslashes($Objs->tripAdvisorRatingUrl)),'address1'=>stripslashes($Objs->address1), 'lowRate'=>number_format($Objs->lowRate, 2),'highRate'=>number_format($Objs->highRate, 2),'discount_price'=>$Objs->discount_price);
	}
	$data['result'] =array_chunk($dt, 4);
	
	$datastr = json_encode($data);
	echo $datastr;
	die;
}

/*
function addCustomHotelData($search_Session_Id,$desti_lat_lon,$checkIn_db,$checkOut_db){
	global $wpdb;
	
	$desti_lat_lon_arr =explode('-',$desti_lat_lon);
	
	$lat =$desti_lat_lon_arr[0];
	$long =$desti_lat_lon_arr[1];
	
	$results =$wpdb->get_results("select * from twc_hotels where latitude='".$lat."' and  longitude='".$long."' and  published='Yes' and status_deleted=0");
	
	if(count($results)>0)
	{
	 $sort_order =1;		
	 foreach($results as $obj){
	  $map_lat_long =explode('~',$obj->map_lat_long);
	  
	  $amResults =$wpdb->get_results("select GROUP_CONCAT(Amenety SEPARATOR ', ') as amenety  from hotel_ameneties where hotel_id='".$obj->id."'");
	 
	  $vaid_str =$amResults[0]->amenety;
	  
	  $checkResutls =$wpdb->get_results("select * from search_results_ean where EANHotelID='".$obj->id."'");
	  if(count($checkResutls)==0){
	     $SQL = "insert into search_results_ean set EANHotelID='".$obj->id."', Name='".addslashes($obj->title)."', address1='".$obj->physical_address."', city='".$obj->hotel_destination_Id."', postalCode='', countryCode='IN', propertyCategory='1', hotelRating='".$obj->hotel_star_rating."', hotelRatingDisplay='Star', confidenceRating='0', amenityMask='', tripAdvisorRating='".$obj->trip_advisor_rating."', tripAdvisorReviewCount='".$obj->trip_Advisor_review_counts."', tripAdvisorRatingUrl='".$obj->tripAdvisor_Link."', promoDescription='".$obj->Discount_Promo."', locationDescription='', shortDescription='".$obj->hotel_info."', highRate='".$obj->Average_Price."', lowRate='".$obj->Discounted_Price."', discount_price='".($obj->Average_Price-$obj->Discounted_Price)."', rateCurrencyCode='USD', latitude='".$map_lat_long[0]."', longitude='".$map_lat_long[1]."', proximityDistance='0.00', proximityUnit='MI', hotelInDestination='1', thumbNailUrl='".$obj->thumbnail."',desti_lat_lon='".$desti_lat_lon."',valueAdds='".$vaid_str."', date_time='".date("Y-m-d")."', checkin='".$checkIn_db."', checkout='".$checkOut_db."', currency='".$_SESSION['Cri_currency']."',language='".$_SESSION['Cri_language']."', search_session='".$search_Session_Id."', Cri_Adults='', sort_order='".$sort_order."',h_owner='custom'"; 
		 $wpdb->query($SQL);
	  }
	  $sort_order++;
	 }
	}
	
}


function getCustomRooms($hotel_id){
	global $wpdb;
	$hresults =$wpdb->get_results("select id,title,physical_address,hotel_destination_Id from twc_hotels where id='".$hotel_id."'");
	
	$hObj =$hresults[0];
	
	$results =$wpdb->get_results("select * from twc_hotel_rooms where hotel_id='".$hotel_id."'");
	$data =array();
	if(count($results)>0){
		foreach($results as $obj){
		 $roomsArr[]=array('rateCode'=>$obj->id,
		                   'room_id'=>$obj->id,
		                   'hotel_id'=>$obj->hotel_id,
						   'averageBaseRate'=>$obj->room_average_price,
						   'averageRate'=>$obj->room_sale_price,
						   'promoDescription'=>$obj->room_promo,
		                   'rateDescription'=>$obj->room_name,
						   'descriptionLong'=>$obj->room_description,
						   'checkInInstructions'=>$obj->checkin_instruction,
						   'specialCheckInInstructions'=>$obj->special_checkin_instruction,
						   'cancellationPolicy'=>$obj->cancellation_policy,
						   'room_img'=>$obj->room_img
						   );
		}
	}
	
	
	$data['HotelRoomAvailabilityResponse'] =array('size'=>count($results),
	                                              'hotelName'=>$hObj->title,
												  'hotelAddress'=>$hObj->physical_address,
                                                  'hotelCity'=>$hObj->hotel_destination_Id,
 												  'hotelCountry'=>'',
												  'arrivalDate'=>$_SESSION['checkIn'],
												  'departureDate'=>$_SESSION['checkOut'],
												  'numberOfRoomsRequested'=>$_SESSION['no_of_rooms'],
	                                              'HotelRoomResponse'=>$roomsArr
	                                              );
	return json_encode($data);											  
	
}
*/

function update_custom_hotels($lat,$lon,$desti_lat_lon,$checkIn_db,$checkOut_db,$search_Session_Id,$sort_order){
	global $wpdb;	
	$meta_query =array();
	$meta_query[] =array('key' => 'latitude',
						   'value' =>$lat,
						   'compare' => '=');
    $meta_query[] =array('key' => 'longitude',
						   'value' =>$lon,
						   'compare' => '=');						   
   $args = array(
		'post_type' => 'hotels',
		'post_status' => 'publish',
		'posts_per_page' => -1,
		//'orderby' => $orderby,
		//'order' => $order,
		'meta_query' =>array($meta_query)
		);
	$loop = new WP_Query($args);
	$hotelData =array();
	if ($loop->have_posts()) {
		while ($loop->have_posts()) {
		   $loop->the_post();
		   $PostID  = get_the_ID();
		   $title =get_the_title($PostID);
		   $image = wp_get_attachment_image_src( get_post_thumbnail_id( $PostID ), 'single-post-thumbnail' );
		   $thumbnail =$image[0];
		   $postMeta = get_post_meta($PostID);
		   
		   /*
		   $hotelData[] =array('hotelId'=>$PostID,'name'=>stripslashes($title),'thumbNailUrl'=>stripslashes($thumbnail),'hotelRating'=>stripslashes(round($postMeta['hotel_rating'][0])),'popularity'=>stripslashes($postMeta['tripadvisor_reviews_count'][0]),'tripAdvisorRatingUrl'=>str_replace("http:","",stripslashes($postMeta['tripadvisor_link'][0])),'address1'=>stripslashes($postMeta['hotel_address'][0]), 'lowRate'=>number_format($postMeta['sale_price'][0], 2),'highRate'=>number_format($postMeta['average_price'][0], 2),'discount_price'=>($postMeta['average_price'][0]-$postMeta['sale_price'][0]),'latitude'=>$postMeta['hotel_latitude'][0],'longitude'=>$postMeta['hotel_longitude'][0],'promoDescription'=>$postMeta['promo_text'][0],'isFavourate'=>'','isCustom'=>'Yes');
		   */
		   
		   $discount =($postMeta['average_price'][0]-$postMeta['sale_price'][0]);
		   if($discount>0){
			 $discount_price=$discount;
		   }else{
			 $discount_price=0;  
		   }
		   $proximityDistance =2;
		   $proximityUnit ='MI';
		   $hotelInDestination =1;
		   $vaid_str =$postMeta['amenty'][0];
		   $destination_Arr =explode(",",$postMeta['destination'][0]);
		   $country =$destination_Arr[count($destination_Arr)-1];	
		   $ress =$wpdb->get_results("select * from search_results_ean where EANHotelID='".$PostID."' and currency='".$_SESSION['Cri_currency']."' and language='".$_SESSION['Cri_language']."' and is_custom=1");		   		 
		   $tripAdvisor_rating =$postMeta['tripAdvisor_rating'][0];		
		   $tripAdvisorRatingUrl ='//www.tripadvisor.com/img/cdsi/img2/ratings/traveler/'.$tripAdvisor_rating.'-123456-4.gif';		
		   if(count($ress)>0){		
		   $SQL = "update search_results_ean set Name='".addslashes($title)."', address1='".addslashes($postMeta['hotel_address'][0])."', city='".addslashes($postMeta['destination'][0])."', postalCode='', countryCode='".$country."', propertyCategory='1', hotelRating='".$postMeta['hotel_rating'][0]."', hotelRatingDisplay='Star', confidenceRating='', amenityMask='', tripAdvisorRating='".$tripAdvisor_rating."', tripAdvisorReviewCount='".$postMeta['tripadvisor_reviews_count'][0]."', tripAdvisorRatingUrl='".$tripAdvisorRatingUrl."', promoDescription='".addslashes($postMeta['promo_text'][0])."', locationDescription='', shortDescription='', highRate='".$postMeta['average_price'][0]."', lowRate='".$postMeta['sale_price'][0]."', discount_price='".$discount_price."', rateCurrencyCode='USD', latitude='".$postMeta['hotel_latitude'][0]."', longitude='".$postMeta['hotel_longitude'][0]."', proximityDistance='".addslashes($proximityDistance)."', proximityUnit='".$proximityUnit."', hotelInDestination='".$hotelInDestination."', thumbNailUrl='".$thumbnail."',desti_lat_lon='".$desti_lat_lon."',valueAdds='".addslashes($vaid_str)."', date_time='".date("Y-m-d")."', checkin='".$checkIn_db."', checkout='".$checkOut_db."',search_session='".$search_Session_Id."' where  EANHotelID='".$PostID."' and currency='".$_SESSION['Cri_currency']."' and language='".$_SESSION['Cri_language']."' and is_custom=1";  	
		   }else{
		   $SQL = "insert into search_results_ean set EANHotelID='".$PostID."', Name='".addslashes($title)."', address1='".addslashes($postMeta['hotel_address'][0])."', city='".addslashes($postMeta['destination'][0])."', postalCode='', countryCode='".$country."', propertyCategory='1', hotelRating='".$postMeta['hotel_rating'][0]."', hotelRatingDisplay='Star', confidenceRating='', amenityMask='', tripAdvisorRating='".$tripAdvisor_rating."', tripAdvisorReviewCount='".$postMeta['tripadvisor_reviews_count'][0]."', tripAdvisorRatingUrl='".$tripAdvisorRatingUrl."', promoDescription='".addslashes($postMeta['promo_text'][0])."', locationDescription='', shortDescription='', highRate='".$postMeta['average_price'][0]."', lowRate='".$postMeta['sale_price'][0]."', discount_price='".$discount_price."', rateCurrencyCode='USD', latitude='".$postMeta['hotel_latitude'][0]."', longitude='".$postMeta['hotel_longitude'][0]."', proximityDistance='".$proximityDistance."', proximityUnit='".$proximityUnit."', hotelInDestination='".$hotelInDestination."', thumbNailUrl='".$thumbnail."',desti_lat_lon='".$desti_lat_lon."',valueAdds='".addslashes($vaid_str)."', date_time='".date("Y-m-d")."', checkin='".$checkIn_db."', checkout='".$checkOut_db."', currency='".$_SESSION['Cri_currency']."',language='".$_SESSION['Cri_language']."', search_session='".$search_Session_Id."', Cri_Adults='',is_custom=1, sort_order='".$sort_order."'";		  
		   }
		   $wpdb->query($SQL);
		   $sort_order++;
		}
	}
}


if($_REQUEST["action"]=="BookingCancellation"){
	
	$itineraryId =$_REQUEST["itineraryId"];
	$ext_param ='&itineraryId='.$_REQUEST["itineraryId"].'&email='.$_REQUEST['bc_email'].'&confirmationNumber='.$_REQUEST['confirmationNumber'].'&reason='.$_REQUEST['reason'];
	$URL = $actionUrl.'?action=BookingCancellation&'.$Param.$ext_param;
	
	$cResults =$wpdb->get_results("select * from twc_booking where itineraryId='".$itineraryId."'");
	$cResult =$cResults[0];
	if($cResult->is_custom==1){
	 $cancellationNumber=$cResult->itineraryId.'-'.$cResult->confirmationNumbers;
     $contents='Booking cancelled of custom hotel';	 
	}
	else{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $URL);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	$contents = curl_exec($ch);
	curl_close ($ch);
	$contents =str_replace("@","",$contents);
   
	$obj =json_decode($contents);
	$cancellationNumber =$obj->HotelRoomCancellationResponse->cancellationNumber;
	}
	
	$flag=0;
	if($cancellationNumber!='')
	{
		$wpdb->query("update twc_booking SET cancellationNumber='".$cancellationNumber."',booking_status='Cancelled', cancellation_response='".$contents."',cancellation_date='".date('Y-m-d H:i:s')."' where itineraryId='".$itineraryId."'");
		$flag=1;
		
		$results =$wpdb->get_results("select * from twc_booking where itineraryId='".$itineraryId."'");
		$result =$results[0];
		$booking_status = $result->booking_status;
		$cancellationNumber = $result->cancellationNumber;
		$itinerary_id = $result->itineraryId;
		$arrivalDate =$result->check_in;
		$departureDate =$result->check_out;
		$hotelName =$result->hotelName;
		$hotelAddress =$result->hotelAddress;
		$hotelCity =$result->hotelCity;
		$hotelCountryCode =$result->hotelCountryCode;
		$hotelfullAddress=$hotelAddress.' '.$hotelCity.' '.$hotelCountryCode;
		$hotelRating =$result->hotelRating;
		$checkInInstructions =$result->checkInInstructions;
		$user_name =$result->user_name;
		$user_email =$result->user_email;
		
		$booking_results =json_decode($result->response_xml,true);
		$HotelRoomReservationResponse =$booking_results['HotelRoomReservationResponse'];
		$numberOfRoomsBooked =$HotelRoomReservationResponse['numberOfRoomsBooked'];
		$roomDescription =$HotelRoomReservationResponse['roomDescription'];
		if($result->is_custom==1){
		 $hotel_img =$result->hotel_img;	
		 $cancellationPolicy =$HotelRoomReservationResponse['cancellationPolicy'];	
		 $RoomGroups =$HotelRoomReservationResponse['RoomGroups'];
		 $total_adults=0;
         $total_childs=0; 
		 for($i=0;$i<count($RoomGroups);$i++){
		  $total_adults =($total_adults+$RoomGroups[$i]['adults']);	 
		  $total_childs =($total_childs+$RoomGroups[$i]['childs']);	 
		 }
		 
		 $nRefundable='N/A';
         $smokingPreference='';
		}
		else{
		$hotel_img ='http:'.str_replace("_b","_t",$result->hotel_img);
		if (@array_key_exists("RateInfos",$HotelRoomReservationResponse)){
		$Rooms =$HotelRoomReservationResponse['RateInfos']['RateInfo']['RoomGroup']['Room'];
		}else{
		$Rooms =$HotelRoomReservationResponse['RoomGroup']['Room'];
		}
					
		if (@array_key_exists("0",$Rooms)){
		$Room_arr =$Rooms;
		}else{
		$Room_arr[] =$Rooms;
		}
		$total_adults =0;
		$total_childs =0;
		foreach($Room_arr as $Room){
		$total_adults =$total_adults+$Room['numberOfAdults'];
		$total_childs =$total_childs+$Room['numberOfChildren'];
		}
		if (@array_key_exists("RateInfos",$HotelRoomReservationResponse)){
		$ChargeableRateInfo =$HotelRoomReservationResponse['RateInfos']['RateInfo']['ChargeableRateInfo'];
		$nonRefundable =$HotelRoomReservationResponse['RateInfos']['RateInfo']['nonRefundable'];
		$smokingPreference =$HotelRoomReservationResponse['RateInfos']['RateInfo']['RoomGroup']['Room']['smokingPreference'];
		}else{
		$ChargeableRateInfo =$HotelRoomReservationResponse['RateInfo']['ChargeableRateInfo'];
		$nonRefundable =$HotelRoomReservationResponse['nonRefundable'];
		}
		if($nonRefundable!=''){
		$nRefundable='No';
		}else{
		$nRefundable='Yes';
		}
		if (@array_key_exists("RateInfos",$HotelRoomReservationResponse)){
		$cancellationPolicy= $HotelRoomReservationResponse['RateInfos']['RateInfo']['cancellationPolicy'];
		}else{
		$cancellationPolicy =$HotelRoomReservationResponse['RateInfo']['cancellationPolicy'];
		}
	  }
		
		
		$no_of_nights = floor(strtotime($departureDate)-strtotime($arrivalDate))/(60*60*24);
		
		
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		$headers  .= 'From: <'.$admin_email.'>' . "\r\n";
		
		$subject =''.$user_name.' has cancelled hotel booking ('.$itineraryId.')';
		$message ='<table width="100%" cellspacing="5" cellpadding="0">
  <tbody><tr>
    <td align="center">
        <p style="width:600px;margin:20px 0;padding:0;text-align:left;color: #555555;">
        <font style="font-family:Tahoma,sans-serif;font-size:25px">
Your reservation has been cancelled.</font>
        </p>

        <table style="border-width:1px;border-style:solid;border-radius:4px;padding:0;margin:0" width="600" cellspacing="0" cellpadding="0">
            <tbody><tr>
                <td class="m_-3909866850051021952primary-content-container" style="padding:10px;text-align:left;background: #f6f6f6;" valign="top">

                    <table style="border-width:1px;border-style:solid;border-radius:4px;padding:10px;margin-bottom:10px;background: #fff;" class="m_-3909866850051021952primary-content-table" width="100%">
                        <tbody><tr>
                            <td valign="top">


<table style="margin:0 0 15px 0;padding:0;color:#555555;" width="98%">
    <tbody><tr>
        <td width="270" valign="top">
            <font style="font-family:Tahoma,sans-serif;font-size:13px">
                <b>Guest Name:</b>
            </font>
        </td>
        <td valign="top">
            <font style="font-family:Tahoma,sans-serif;font-size:13px">
            '.$result->user_name.'
            </font>
        </td>
    </tr>
    <tr>
        <td width="270" valign="top">
            <font style="font-family:Tahoma,sans-serif;font-size:13px">
                <b>Guest Email:</b>
            </font>
        </td>
        <td valign="top">
            <font style="font-family:Tahoma,sans-serif;font-size:13px">
            <a href="mailto:'.$user_email.'" target="_blank">'.$user_email.'</a>
            </font>
        </td>
    </tr>
    <tr>
        <td width="270" valign="top">
            <font style="font-family:Tahoma,sans-serif;font-size:13px">
                <b>Itinerary Number:</b>
            </font>
        </td>
        <td valign="top">
            <font style="font-family:Tahoma,sans-serif;font-size:13px">
            '.$itinerary_id.'
            </font>
        </td>
    </tr>
</tbody></table>

           </td>
         </tr>
    </tbody></table>

<table style="border-width:1px;border-style:solid;border-radius:4px;padding:10px;margin-bottom:10px;background: #fff;" class="m_-3909866850051021952primary-content-table" width="100%">
    <tbody><tr>
        <td valign="top">
            <h2 style="margin:0;padding:0;border-bottom: 1px solid #ccc;color: #555555;">
                <font style="font-family:Tahoma,sans-serif;font-size:16px;font-weight:normal">
                Hotel</font>
            </h2>
            <hr style="height:1px;border:0;margin:5px 0 10px 0;padding:0">

            <table width="98%" cellspacing="0" cellpadding="0" style="color:#555555;">
                <tbody><tr>
                    <td width="85" valign="top">
                        <div class="m_-3909866850051021952thumb" style="border-width:2px;float:none;height:68px;overflow:hidden;width:68px">
                            <img src='.$hotel_img.' style="padding:0" class="CToWUd">
                        </div>
                    </td>

                    <td valign="top">
                        <p style="margin:0;padding:0">
                            <font style="font-family:Tahoma,sans-serif;font-size:18px">
                            '.$hotelName.'
                            </font>
                        </p>
                       

                        <table style="margin:15px 0;padding:0;color: #555555;" width="98%" cellspacing="0">
                            <tbody><tr>
                                <td valign="top"><font style="font-family:Tahoma,sans-serif;font-size:13px">
                                    <b>Address:</b>
                                </font>
                                </td>
                                <td>
                                    <font style="font-family:Tahoma,sans-serif;font-size:13px">
                                    '.$hotelfullAddress.'
                                    </font>
                                </td>
                            </tr>
                        </tbody></table>

                    </td>

                    <td width="95" valign="top" align="center">

                    </td>

                </tr>
            </tbody></table>
            <hr style="height:1px;border:0;margin:5px 0 10px 0;padding:0">

            <table style="margin:5px 0 15px 0;padding:0;color: #555555;" width="98%" cellspacing="0" cellpadding="0">
                <tbody><tr>
                    <td width="155"><font style="font-family:Tahoma,sans-serif;font-size:12px"><b>Check-in:</b></font></td>
                    <td width="155"><font style="font-family:Tahoma,sans-serif;font-size:12px"><b>Check-out:</b></font></td>


                    <td width="100"><font style="font-family:Tahoma,sans-serif;font-size:12px"><b>Nights:</b></font></td>
                    <td><font style="font-family:Tahoma,sans-serif;font-size:12px"><b>Guests:</b></font></td>
                </tr>
                <tr>
                    <td>
                        <p style="margin:10px 0">
                            <font style="font-family:Tahoma,sans-serif;font-size:14px">
                            '.$arrivalDate.'
                            </font>
                        </p>
                    </td>
                    <td>
                        <p style="margin:10px 0">
                            <font style="font-family:Tahoma,sans-serif;font-size:14px">
            <span class="aBn" data-term="goog_1634012258" tabindex="0"><span class="aQJ">'.$departureDate.'</span></span>
                        
                            </font>
                        </p>
                    </td>


                    <td>
                        <p style="margin:10px 0">
                            <font style="font-family:Tahoma,sans-serif;font-size:14px">
                            '.$no_of_nights.'
                            </font>
                        </p>
                    </td>
                    <td>
                        <p style="margin:10px 0">
                            <font style="font-family:Tahoma,sans-serif;font-size:14px">
    '.$total_adults.' adults                            </font>
                        </p>
                    </td>
                </tr>
            </tbody></table>



        </td>
    </tr>
</tbody></table>

<table style="border-width:1px;border-style:solid;border-radius:4px;padding:10px;margin-bottom:10px;background: #fff;" class="m_-3909866850051021952primary-content-table" width="100%">
    <tbody><tr>
        <td valign="top">
            <h2 style="margin:0;padding:0;border-bottom: 1px solid #ccc;color:#555555;"><font style="font-family:Tahoma,sans-serif;font-size:16px;font-weight:normal">Room Details</font></h2>
            <hr style="height:1px;border:0;margin:5px 0 10px 0;padding:0">
            <h3 style="color:#555555;">Room '.$numberOfRoomsBooked.'</h3>
            <table style="margin:5px 0 15px 0;padding:0;line-height:1.75em;color:#555555;" class="m_-3909866850051021952room-level-details" width="98%" cellspacing="0" cellpadding="0">
                <tbody><tr>
                    <td width="120" valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px"><b>Room Type:</b></font>
                    </td>
                    <td valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px">
                            '.$roomDescription.'
                        </font>
                    </td>
                </tr>
                <tr>
                    <td valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px"><b>Smoking:</b></font>
                    </td>
                    <td valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px">
                        '.$smokingPreference.'   </font>
                    </td>
                </tr>
                <tr>
                    <td valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px"><b>Reserved for:</b></font>
                    </td>
                    <td valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px">'.$result->user_name.' , '.$total_adults.' adults</font>
                    </td>
                </tr>
                <tr>
                    <td valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px"><b>Status:</b></font>
                    </td>
                    <td valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px">
                            '.$booking_status.', '.$cancellationNumber.'
                        </font>
                    </td>
                </tr>
                <tr>
                    <td valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px"><b>Refundable:</b></font>
                    </td>
                    <td valign="top">
                        <font style="font-family:Tahoma,sans-serif;font-size:13px">
                            '.$nRefundable.'</font>
                    </td>
                </tr>

            </tbody></table>



        </td>
    </tr>
</tbody></table>


<table style="border-width:1px;border-style:solid;border-radius:4px;padding:10px;margin-bottom:10px;background: #fff;color:#555555;" class="m_-3909866850051021952primary-content-table" width="100%">
    <tbody><tr>
        <td valign="top">
            <h2 style="margin:0;padding:0;border-bottom: 1px solid #ccc;"><font style="font-family:Tahoma,sans-serif;font-size:16px;font-weight:normal">Cancellation Policy</font></h2>
            <hr style="height:1px;border:0;margin:5px 0 10px 0;padding:0">

                <font style="font-family:Tahoma,sans-serif;font-size:13px"><b>Room 1</b></font><br>
                <p style="margin-top:0"><font style="font-family:Tahoma,sans-serif;font-size:13px">'.$cancellationPolicy.'</font></p>

        </td>
    </tr>


</tbody></table>



                    <table style="border-width:1px;border-style:solid;border-radius:4px;padding:10px;margin-bottom:10px;background: #fff;color:#555555;" class="m_-3909866850051021952primary-content-table" width="100%">
                        <tbody><tr>
                            <td valign="top">
                                <h2 style="margin:0;padding:0;border-bottom: 1px solid #ccc;">
                                    <font style="font-family:Tahoma,sans-serif;font-size:16px;font-weight:normal">
Refund Information                                    </font>
                                </h2>
                                <hr style="height:1px;border:0;margin:5px 0 10px 0;padding:0">

                                <p style="margin-top:0">
                                    <font style="font-family:Tahoma,sans-serif;font-size:13px">
If you are due a refund, we have issued a refund request. Please note refunds may take up to 45 days from cancellation date to be visible on your account.                                    </font>
                                </p>

                            </td>
                        </tr>
                    </tbody></table>
					
                </td>
            </tr>
        </tbody></table>
    </td>
</tr>


</tbody></table>';
		@mail($result->user_email,$subject,$message,$headers);
        // admin mail
		if($result->is_custom==1){
		    $a_subject ='Booking cancellation mail(Custom Hotel)';
		}else{
		    $a_subject ='Booking cancellation mail';	
		}
		@mail($mk_options['bookin_email'],$a_subject,$message,$headers);
		
	}
	echo $flag;
}
?> 	
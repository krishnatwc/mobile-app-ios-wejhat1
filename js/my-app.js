// Initialize your app
var myApp = new Framework7({
    modalTitle: 'My App',
    // If it is webapp, we can enable hash navigation:
    pushState: true,
    material: true,
	animatePages:true,
	
    cache: false,
	panel: {
		swipe: 'left',
	},
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
	
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
   domCache: true,
});




var RequestURL ='http://twc5.com/demo/MobAppRequest';
$$(document).on('pageInit',function(e){
  // Do something here when the page laod and initialize	
 var page =e.detail.page;
/*
 if(page.name=='about'){
	 var count =page.query.count;
	 var listHtml ='<ul>';
	 for(var i=0;i<count;i++){
		listHtml+='<li>'+i+'</li>'; 
	 }
	 listHtml+='</ul>';
	 $$(page.container).find('.page-content').append(listHtml);
 }
 if(page.name=='products'){
	alert('Helow Product'); 
 }*/

 /*=== Hotel Search Box page ====*/ 
if(page.name=='search-hotels'){
	var currDate =new Date();
  /* ===== Calendar ===== */
    var weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	
  var today =new Date();
	var calendarRange = myApp.calendar({
    input: '#appCalendar',
    dateFormat: 'M dd yyyy',
    rangePicker: true,
	minDate: today,
	onChange: function (p, values, displayValues){  
		var start =values[0];
		var end =values[1];
		
		var sMonth =start.getMonth() < 12 ? start.getMonth() + 1 : 1;
		var eMonth =end.getMonth() < 12 ? start.getMonth() + 1 : 1;
		
		var startDate = sMonth+'/'+start.getDate()+'/'+start.getFullYear(); 
		var endDate =eMonth+'/'+end.getDate()+'/'+end.getFullYear();
		var startDate_txt = weekday[start.getDay()]+', '+start.getDate()+' '+monthNames[start.getMonth()]+' '+start.getFullYear().toString().substr(-2);
		var endDate_txt = weekday[end.getDay()]+', '+end.getDate()+' '+monthNames[end.getMonth()]+' '+end.getFullYear().toString().substr(-2);
		
		$$('#startDate').val(startDate);
		$$('#endDate').val(endDate);
		$$('#startDate_txt').html(startDate_txt);
		$$('#endDate_txt').html(endDate_txt);
		
	   }
    });

   
   var glob =0;
   $$('.addMoreRooms').on('click', function () {
	  var numRooms = $$('.roomListcls').length;
	  var n =parseInt(numRooms)+1;
	  $$('#number_of_rooms').val(n);
	  glob++;
	  var pacHtml='';
      pacHtml+='<div class="card ks-facebook-card roomListcls">'+
	            '<input type="hidden" name="adults[]" id="adults_'+glob+'" value="1"><input type="hidden" name="childs[]" id="childs_'+glob+'" value="0">'+
			'<div class="card-footer no-border"><a href="#" class="link rooming">Room '+n+'</a><a href="#" class="link deleteRooms" ><i class="material-icons">delete</i></a></div>'+
				'<div class="card-content">'+
				 '<div class="content-block">'+ 
					'<div class="roomPagePadding">'+ 
						'<div class="row margin_br">'+
							'<div class="col-60">'+ 
								'<div class="roomPageTitle">Adults</div>'+
								'<div class="roomPageTitleBottom">Above 12 yrs</div>'+
							'</div>'+
							'<div class="col-40">'+
								'<div class="row roomPagePaddingBottom">'+
									'<div class="col-33">'+
										'<a href="#" class="link left minusAdults" rel="'+glob+'"><i class="material-icons">remove</i></a>'+
									'</div>'+
									'<div class="col-33">'+
										'<a href="#" class="link center" id="countAdults_'+glob+'">1</a>'+ 
									'</div>'+
									'<div class="col-33">'+
										'<a href="#" class="link right plusAduls" rel="'+glob+'"><i class="material-icons">add</i></a>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="roomPagePadding">'+
						'<div class="row">'+
							'<div class="col-60 marginbr"> '+
								'<div class="roomPageTitle">Children</div>'+
								'<div class="roomPageTitleBottom">0-12 yrs</div>'+
							'</div>'+
							'<div class="col-40">'+
								'<div class="row roomPagePaddingBottom">'+
									'<div class="col-33">'+
										'<a href="#" class="link left minusChilds" rel="'+glob+'"><i class="material-icons">remove</i></a>'+
									'</div>'+
									'<div class="col-33">'+
										'<a href="#" class="link center" id="countChilds_'+glob+'">0</a>'+
									'</div>'+
									'<div class="col-33">'+
										'<a href="#" class="link right plusChilds" rel="'+glob+'"><i class="material-icons">add</i></a>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="row"><div class="col-30">&nbsp;</div><div class="col-70 childAgeCls" id="childAgeList_'+glob+'"></div></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>';	 
	 $$('#roomspacksDetails').append(pacHtml);
	 
	 if(n==3){ $$('.addMoreRooms').hide();}
	 else{$$('.addMoreRooms').show();}
	  
	 deleteRooms();
	 roomAndGuestCount();
	});
  
  function deleteRooms(){
	$$('.deleteRooms').on('click',function(e){
	  e.preventDefault();
	  $$(this).closest('.roomListcls').remove();
	  var numRooms = $$('.roomListcls').length;
	  $$('#number_of_rooms').val(numRooms);
	  $$('.addMoreRooms').show();
	  
	  var v=1;
	  $$(".rooming").each(function() {
		  $$(this).html('Room '+v);
		  v++;
	   });
    })  
  }
  
  
  $$("body").on("click", ".plusAduls", function(e){
	 e.preventDefault(); 
     var rel = $$(this).attr('rel');
	 var adt =$$('#countAdults_'+rel).html();
	 var adult= parseInt(adt)+1;
	 if(adult<=4){
	  $$('#countAdults_'+rel).html(adult);
	  $$('#adults_'+rel).val(adult);
	  roomAndGuestCount();
	 }
  });
  $$("body").on('click','.minusAdults',function(e){
	e.preventDefault();	
	var rel = $$(this).attr('rel');
	var adt =$$('#countAdults_'+rel).html();
	var adult= parseInt(adt)-1;
	if(adult>=1){
	 $$('#countAdults_'+rel).html(adult);
	 $$('#adults_'+rel).val(adult);
	 roomAndGuestCount();
	}
  });
  
  $$("body").on('click','.plusChilds',function(e){
	e.preventDefault();	
	var rel = $$(this).attr('rel');
	var adt =$$('#countChilds_'+rel).html();
	var child= parseInt(adt)+1;
	if(child<=3){
	$$('#countChilds_'+rel).html(child);
	$$('#childs_'+rel).val(child);
	 manageChildAge(child,rel);
	 roomAndGuestCount();
	}
  });
  
  $$("body").on('click','.minusChilds',function(e){
	e.preventDefault();	
	var rel = $$(this).attr('rel');
	var adt =$$('#countChilds_'+rel).html();
	var child= parseInt(adt)-1;
	if(child>=0){
	$$('#countChilds_'+rel).html(child);
	$$('#childs_'+rel).val(child);
	manageChildAge(child,rel);
	roomAndGuestCount();
	}
  });
  
  function manageChildAge(child,rel){
	 var ageHtml ='';
	 for(var i=0;i<child;i++){
	   ageHtml+='<select name="childAge['+rel+'][]" relKey='+rel+'><option value="0"> < 1 </option><option value="1"> 1 </option><option value="2"> 2 </option></select>';	 
	 }
	 $$("#childAgeList_"+rel).html(ageHtml);
  }
  
  function roomAndGuestCount(){
	var adts  = document.getElementsByName('adults[]');
	var chds  = document.getElementsByName('childs[]');
	var guest=0;
    for (var i = 0; i <adts.length; i++) {
	  var adt=adts[i].value;
	  guest =parseInt(guest)+parseInt(adt);
	}
	
	for (var c = 0; c <chds.length; c++) {
	  var chd=chds[c].value;
	  guest =parseInt(guest)+parseInt(chd);
	}
	
	var rooms =$$('#number_of_rooms').val();
   	$$('#roomGuestTxt').html(rooms+' Rooms, '+guest+' Guests ');
	$$('#selectedDest_adults').html(rooms+' Rooms, '+guest+' Guests ');
  }
  
  
  /*=== Auto suggetion ===*/
  
  var autocompleteDropdownAjax = myApp.autocomplete({
	opener: $$('#autocomplete-standalone-popup'),
    openIn: 'popup',
	backOnSelect: true,
    preloader: true, 
    valueProperty: 'fullname', 
    textProperty: 'fullname', 
    limit: 20, 
	autoFocus: true,
    dropdownPlaceholderText: 'Try "JavaScript"',
    expandInput: true, 
    source: function (autocomplete, query, render) {
        var results = [];
        if (query.length === 0) {
            render(results);
            return;
        }
        autocomplete.showPreloader();
        $$.ajax({
            url: 'http://yasen.hotellook.com/autocomplete',
            method: 'GET',
            dataType: 'json',
            data: {
                term: query,
				action: "Location_Fetch",
				lang: 'en',
				limit: 5
            },
            success: function (data) {
				var myData =data.cities; 
                for (var i = 0; i < myData.length; i++) {
                   if (myData[i].fullname.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(myData[i]);
                }
                autocomplete.hidePreloader();
                render(results);
            }
        });
    },
	onChange: function (autocomplete, value) { 
	 var dataObj =value[0];
	 $$('#destination').val(dataObj.latinFullName);	
     $$('#selectedDest').html(dataObj.latinFullName);	 	 
     $$('#latitude').val(dataObj.location.lat);
     $$('#longitude').val(dataObj.location.lon);
	}
	
   });
  
  
  $$('.findFlightResults').on('click', function(e){
	alert("Test");
		var url ='search-flight-results.html?destination='+$$('#destination').val()+'&latitude='+$$('#latitude').val()+'&longitude='+$$('#longitude').val()+'&checkIn='+$$('#startDate').val()+'&checkOut='+$$('#endDate').val()+'&Cri_currency=USD&Cri_language=en_US&hotelType=1&rooms='+$$('#number_of_rooms').val()+'&adults='+adultsArr+'&childs='+childsArr+'&childAge=';
	   mainView.router.loadPage(url);
		
		
   });
  
  
  
   $$('.findHotelResults').on('click', function(e){
	   
	   e.preventDefault();	
	   var formData = myApp.formToData('#searchHotel_frm');
	   myApp.formStoreData('HotelRequestData',formData);
	   var adts  = document.getElementsByName('adults[]');
	   var chds  = document.getElementsByName('childs[]');
	 
	   var adultsArr= new  Array;
	   var childsArr= new  Array;
	   var childAgeArr= new  Array;
	   for (var i = 0; i <adts.length; i++) {
		  var adt=adts[i].value;
		  adultsArr.push(adt);
		}
	   for (var i = 0; i <chds.length; i++) {
		  var chd=chds[i].value;
		  childsArr.push(chd);
		}
		childsArr=0;
	  
		$$('.childAgeCls select').each(function(){ 
		   var relKey =$$(this).attr('relKey');
		   childAgeArr.push([relKey, $$(this).val()]); 
		});
		
	   var url ='search-results.html?destination='+$$('#destination').val()+'&latitude='+$$('#latitude').val()+'&longitude='+$$('#longitude').val()+'&checkIn='+$$('#startDate').val()+'&checkOut='+$$('#endDate').val()+'&Cri_currency=USD&Cri_language=en_US&hotelType=1&rooms='+$$('#number_of_rooms').val()+'&adults='+adultsArr+'&childs='+childsArr+'&childAge=';
	   mainView.router.loadPage(url);
   })
  
 }
 
 /*=== Search Result page ====*/
 if(page.name=='search-results')
 {
   var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

   var destination =page.query.destination;
   var latitude =page.query.latitude;	 
   var longitude =page.query.longitude;	 
   var checkIn =page.query.checkIn;
   var checkOut =page.query.checkOut;
   var Cri_currency =page.query.Cri_currency;
   var Cri_language =page.query.Cri_language;
   var checkOut =page.query.checkOut;
   var rooms =page.query.rooms;
   var adults = page.query.adults;
   var childs = page.query.childs;
   var childAge = page.query.childAge;
   
   var checkindate = checkIn.split("/");
   var checkoutdate = checkOut.split("/");
   
   if( (destination!='') && (latitude!='') && (longitude!=''))
   {
	 $$(".search-resultsPageNavbarTitle").html(destination);
	 $$("#startenddate").html(checkindate[1] + " " + monthNames[(parseInt(checkindate[0])-1)] + " - " + checkoutdate[1] + " " + monthNames[(parseInt(checkoutdate[0])-1)]);
	 $$("#noofguestenddate").html(rooms);
	 //checkIn=05/28/2018&checkOut
	 
	 //alert("Started");
	 var param ={actionType:'findSearchKey',lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge};
	 
	 $$.get(RequestURL+'/update_rates.php',param, function (response,status) {
		 var myData =JSON.parse(response);
		 var search_Session_Id =myData.search_session;
		 var exist =myData.exist;
		 $$('#search_Session_Id').val(search_Session_Id);
		 if(exist=='Yes'){
			Searched_Hotels(); 
		 }
		 else{
			Upldate_Rates(); 
		 }
		  filtrationHtml(); 
	  });

     function Upldate_Rates(){ 
	     var search_Session_Id = $$('#search_Session_Id').val();
		 
		 var param ={actionType:'Upldate_Rates',search_Session_Id:search_Session_Id,lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge};
		 $$.get(RequestURL+'/update_rates.php',param, function (response,status) {
			 myApp.hideIndicator(); 
			 if(status==200){
			   var myData =JSON.parse(response);
			   myApp.formStoreData('HotelLists',myData.HotelListResponse.HotelList.HotelSummary);
			   var getHotelLists = myApp.formGetData('HotelLists'); 
			   listHotelResults(getHotelLists);
			   Upldate_Rates_All();
			 } 
		 });
	 }
    
    function Upldate_Rates_All(){
		var search_Session_Id = $$('#search_Session_Id').val();
	    var param ={actionType:'Upldate_Rates_All',search_Session_Id:search_Session_Id,lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge};
		 $$.get(RequestURL+'/update_rates.php',param, function (response,status) {
		 if(status==200){
		   	 $$('#totalrecords').val(response);
			 $$('#counthotel').html(response);
		 } 
	    });
     }
	
    function Searched_Hotels(){
	$$("#hotelResults").css("opacity", "0.5");
	  var search_Session_Id = $$('#search_Session_Id').val();
	  
	  var Cri_destination =$$('input[name=Cri_destination]:checked').val();
	  var Cri_Rating = [];
	  $$("input[name='Cri_Rating[]']:checked").each(function (){
		Cri_Rating.push($$(this).val());
	  });
	  
	  var Cri_amenity = [];
	  $$("input[name='Cri_amenity[]']:checked").each(function (){
		Cri_amenity.push($$(this).val());
	  });
	  
      var sortField =$$('#sortField').val(sortField);
      var sortby = $$('#sortby').val(sortby);  	  
	  
	   var param ={actionType:'Searched_Hotels',search_Session_Id:search_Session_Id,lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge,page:1,Cri_destination:Cri_destination,Cri_Rating:Cri_Rating,Cri_amenity:Cri_amenity,orderby_fild:sortField,orderby_val:sortby};
	   $$.get(RequestURL+'/update_rates.php',param, function (response,status) {
		 if(status==200){
		   var myData =JSON.parse(response);
		   var totalrecords =myData.totalrecords;
		   var getHotelLists=myData.result;
		    $$('#totalrecords').val(totalrecords);
			$$('#counthotel').html(totalrecords);
		    listHotelResults(getHotelLists,0);	
			$$("#hotelResults").css("opacity", "1");
		 } 
	    });
	} 	
   }
   
   
   $$('.sortingHotels').on('click', function (e) {
	 var getHotelLists = myApp.formGetData('HotelLists');  
     var sortField = $$(this).attr('sortField');
	 var rel = $$(this).attr('rel');
	 if(rel==0){
	   var sortby ='ASC';	 
	   $$(this).attr('rel',1);
	 }
	 else{
	   var sortby ='DESC';	 
	   $$(this).attr('rel',0);	 
	 }
	 if(sortField!=''){
	   $$('#sortField').val(sortField);
       $$('#sortby').val(sortby);	   
	   Searched_Hotels();
	 }
   });
   
   function filterResults(){
	$$('.filterResults').on('click',function(e){
	var resultsType =$$('#resultsType').val();	   
	  if(resultsType=='hotel'){
	    Searched_Hotels();
	   }else{
		loading_Google_Map();   
	   }
     });   
   }
   
   
   function listHotelResults(getHotelLists,page){
     if(getHotelLists.length>0){
		 var html=''; 
		for (var i = 0; i < getHotelLists.length; i++) {
		 var thumbNailUrl = getHotelLists[i].thumbNailUrl
             thumbNailUrl =	thumbNailUrl.replace('_t','_b');	 
			
		 html+='<li><div class="card">'+
			   '<div class="card-content">'+
					'<div class="fulldiv_header">'+
					
					
						'<div class="fulldiv_header-left">'+
							'<div class="item-title ResultsTetelHotel">' + getHotelLists[i].name +'</div>'+
							'<div class="item-subtitle ResultsTetelHotell">' + getHotelLists[i].address1 +'</div>'+
							'</div>'+
							'<div class="fulldiv_header-right">'+
							  '<div class="itemTitel12">$' + getHotelLists[i].highRate +'</div>'+
							  '<div class="itemTitel24price">$' + getHotelLists[i].lowRate +'</div>'+
							'</div>'+
					'</div>'+
					
			      '<div class="list-block media-list">'+
				    '<div>'+
					'<a href="detailsPage.html?destination='+destination+'&hotel_id='+getHotelLists[i].hotelId+'&latitude='+latitude+'&longitude='+longitude+'&checkIn='+checkIn+'&checkOut='+checkOut+'&Cri_currency='+Cri_currency+'&Cri_language='+Cri_language+'&rooms='+rooms+'&adults='+adults+'&childs='+childs+'&childAge='+childAge+'" >'+
					'<div class="item-content">'+
					 '<div class="item-media ResultsPagehover">'+
						'<div class="ResultsPageMaxWidth" style="background: url(http://images.trvl-media.com'+ thumbNailUrl +') no-repeat center;height: 118px; width: 114px;">'+
								'<i class="material-icons Resultsfavorite" style="display:none;">favorite</i>';
								if((parseInt(getHotelLists[i].highRate) - parseInt(getHotelLists[i].lowRate)) > 1){
									html+='<div class="divOff5">Save $' + (parseInt(getHotelLists[i].highRate) - parseInt(getHotelLists[i].lowRate)) + '</div>';
								}
				html+='</div>'+
						    '</div>'+
						  '<div class="item-inner">'+
							'<div class="item-subtitle ResultsTetelReviews">'+
								'<div class="ratings icons_strall str_' + getHotelLists[i].hotelRating +'"></div>'+
								'<div class="img5"><img src="'+getHotelLists[i].tripAdvisorRatingUrl+'"></div> <div class="sre4pde40" style="display: none;">'+getHotelLists[i].tripAdvisorRating+'</div></div>'+
							'<div class="boxleftDse">'+
							  '<a href="#" class="materialicon1"><i class="material-icons material-iconsclear">clear</i>Free Cancellation</a>'+'</div>'+
							'<div class="boxleftDse">'+
							  '<a href="#" class="materialicon2"><i class="material-icons material-iconsclear">wifi</i>Free Wi-Fi</a>'+'</div>'+
							  '<div class="boxleftDse">'+
							  '<a href="#" class="materialicon2"><i class="material-icons material-iconsclear">check</i>All Meals</a>'+'</div>'+
							  '<div class="boxleftDse">'+
							  '<a href="#" class="materialicon2"><i class="material-icons material-iconsclear">wifi</i>Half Board</a>'+'</div>'+
							'</div>'+'<div class="ribbon"><span>'+getHotelLists[i].currentAllotment+' rooms left</span></div></div>'+
						 '</div>'+
						  '</div>'+
						'</div>'+
						'</a>'+
					'</div>'+
					'</div>'+
				 '</div>'+
					
					
				'</div></li>';	
		}
		if(page>1){
		 $$('#hotelResults ul').append(html);	
		}
		else{
	     $$('#hotelResults ul').html(html);
		}		 
	 } 	 
   }
   
  
   function filtrationHtml(){
	  var search_Session_Id = $$('#search_Session_Id').val(); 
	  var param ={actionType:'getControls',search_Session_Id:search_Session_Id};
	  $$.get(RequestURL+'/update_rates.php',param, function (response,status) {
		var myData =JSON.parse(response);
	    var filter_distanceHtml ='<label class="checkmark-box"><span class="mls">2 Miles</span><span class="starRatHotel">('+myData.distance2+')</span>'+
		  '<input type="radio" name="Cri_destination" value="2" class="filterResults">'+
		  '<span class="checkmark"></span>'+
		'</label>'+
		'<label class="checkmark-box"><span class="mls">5 Miles</span><span class="starRatHotel">('+myData.distance5+')</span>'+
		  '<input type="radio" name="Cri_destination" value="5" class="filterResults">'+
		  '<span class="checkmark"></span>'+
		'</label>'+
		'<label class="checkmark-box"><span class="mls">10 Miles</span><span class="starRatHotel">('+myData.distance10+')</span>'+
		  '<input type="radio" name="Cri_destination" value="10" class="filterResults">'+
		  '<span class="checkmark"></span>'+
		'</label>'+
		'<label class="checkmark-box"><span class="mls">50 Miles</span><span class="starRatHotel">('+myData.distance50+')</span>'+
		  '<input type="radio" name="Cri_destination" value="50" class="filterResults">'+
		  '<span class="checkmark"></span>'+
		'</label>';
		
	    $$('#filter_distanceHtml').html(filter_distanceHtml); 

        /*=== Star Html ===*/
	 var filter_starHtml ='<ul class="star-ul-li">'+
		 '<li>'+
		   '<input type="checkbox" name="Cri_Rating[]" value="1" class="filterResults">'+
		   '<a href="#">1<i class="fa fa-star" aria-hidden="true"></i><br>('+myData.stars1+')</a></li>'+
		 '<li><input type="checkbox" name="Cri_Rating[]" value="2" class="filterResults">'+
		    '<a href="#">2<i class="fa fa-star" aria-hidden="true"></i><br>('+myData.stars2+')</a></li>'+
		 '<li>'+
		   '<input type="checkbox" name="Cri_Rating[]" value="3" class="filterResults">'+
		   '<a href="#">3<i class="fa fa-star" aria-hidden="true"></i><br>('+myData.stars3+')</a></li>'+
		 '<li>'+
		  '<input type="checkbox" name="Cri_Rating[]" value="4" class="filterResults">'+
		  '<a href="#">4<i class="fa fa-star" aria-hidden="true"></i><br>('+myData.stars4+')</a></li>'+
		 '<li>'+
		  '<input type="checkbox" name="Cri_Rating[]" value="5" class="filterResults">'+
		  '<a href="#">5<i class="fa fa-star" aria-hidden="true"></i><br>('+myData.stars5+')</a></li>'+
		'</ul>';
		
	   $$('#filter_starHtml').html(filter_starHtml); 	
       filterResults();
      });		   
	   
	 /*=== Amenity Html ===*/ 
	  var param ={actionType:'getAmenityControls',search_Session_Id:search_Session_Id};
	  $$.get(RequestURL+'/update_rates.php',param, function (response,status) {
		var results =JSON.parse(response);
		var myData =results.aminity;
		var filter_amenityHtml ='';
		for(var i=0;i<myData.length;i++){
	    filter_amenityHtml+='<label class="checkmark-box"><span class="mls">'+myData[i]+'</span>'+
							  '<input type="checkbox" name="Cri_amenity[]" value="'+myData[i]+'" class="filterResults">'+
							  '<span class="checkmark"></span>'+
							'</label>';
		}
		 $$('#filter_amenityHtml').html(filter_amenityHtml);
	  });		
   }
   
 
   var loading = false;
   var lastLoadedIndex =  $$('.list-block li').length;
   var page =2;
   $$('.infinite-scroll').on('infinite', function () {
      // Exit, if loading in progress
        if (loading) return;
        // Set loading trigger
        loading = true;
		
		var search_Session_Id = $$('#search_Session_Id').val();
		var totalrecords =$$('#totalrecords').val();
		var no_of_pages =Math.ceil(totalrecords/15);
		//alert(no_of_pages+'=>'+page);
		if(no_of_pages>page){
		var param ={actionType:'Searched_Hotels',search_Session_Id:search_Session_Id,lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge,page:page};
        $$.get(RequestURL+'/update_rates.php', param, function (data) {
            loading = false;
            if (data === '') {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                myApp.detachInfiniteScroll($$('.infinite-scroll'));
            }
            else {
                // Append loaded elements to list block
                //$$('#hotelResults').append(data);
				var myData =JSON.parse(data);
		        var getHotelLists=myData.result;
				listHotelResults(getHotelLists,page);
                // Update last loaded index
                lastLoadedIndex = $$('.list-block li').length;
				page++;
            }
        });
	  }else{
		myApp.detachInfiniteScroll($$('.infinite-scroll'));  
	  }
   });
   
   
   
  /*=== Maps ===*/
   var countshowmap =0;
   var map;
   var markers = [];
   var Info_Boxes = [];
   var asc_desc = 1;	
   var Update_Results_Now = null;
   var bounds = new google.maps.LatLngBounds();
   var loc;
   $$(".Hotel_Map_LI_Tab").click(function(){
	  var res_content = $$(this).attr("rel");
      $$('#resultsType').val(res_content);	  
	  if(res_content=='map'){
		$$(this).attr('rel','hotel'); 
        $$('.bindHtmlcl').html('<i class="material-icons">location_on</i>List</span>');			
	    $$('#hotelResults').hide();	
        $$('#map-canvas').show();	
        if(countshowmap==0){ loading_Google_Map(); }
		else{ No_Loader(); }
	    countshowmap++;		
	  }
	  else{
		$$(this).attr('rel','map');
        $$('.bindHtmlcl').html('<i class="material-icons">location_on</i> MAP VIEW</span>');		
		$$('#map-canvas').hide();	  
		$$('#hotelResults').show();	
	  }
    });
	
   function loading_Google_Map(){
		var haightAshbury = new google.maps.LatLng(12.125264,64.234314);
		var mapOptions = {
		zoom: 12,
		center: haightAshbury,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng($$("#cur_rent_lat").val(), $$("#cur_rent_lon").val()),
			map: map,
			icon: 'images/Map-Marker-Flag--Right-Pink.png'
		});
		// Add circle overlay and bind to marker
		var circle = new google.maps.Circle({
			map: map,
			radius: 2500,    // metres
			fillColor: '#AA0000'
		});
		circle.bindTo('center', marker, 'position');

		No_Loader();
	}
	function setAllMap(map) {
	  for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	  }
	}
	function No_Loader(page){
		var search_Session_Id = $$('#search_Session_Id').val();
		var Cri_destination =$$('input[name=Cri_destination]:checked').val();
	    var Cri_Rating = [];
	    $$("input[name='Cri_Rating[]']:checked").each(function (){
		 Cri_Rating.push($$(this).val());
	    });
	  
	    var Cri_amenity = [];
	    $$("input[name='Cri_amenity[]']:checked").each(function (){
		 Cri_amenity.push($$(this).val());
	    });
		
		var param ={actionType:'Show_Markers',search_Session_Id:search_Session_Id,lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge,page:page,Cri_destination:Cri_destination,Cri_Rating:Cri_Rating,Cri_amenity:Cri_amenity};
		
		setAllMap(null);
		var location_right="";
		
		$$.get(RequestURL+'/update_rates.php', param, function (data) {
            var result =JSON.parse(data);
			for(a=0;a<result.length;a++){ 
				addMarker(result[a].Latitude, result[a].Longitude, result[a].Name, result[a].ThumbnailURL, result[a].Address1, result[a].Address2, result[a].StarRating, result[a].shortDescription, result[a].EANHotelID,result[a].LowRate);
				loc = new google.maps.LatLng(result[a].Latitude,result[a].Longitude);
				bounds.extend(loc);
				map.fitBounds(bounds);
			}
        });
	}
	function addMarker(lat, longi, hotel_name, ThumbnailURL, Address1, Address2, StarRating, shortDescription, EANHotelID,LowRate) { //alert(StarRating);
		 //var StarRatingMarker = (Math.round(StarRating)/10);
		 var StarRatingMarker = (Math.round(StarRating));
		 var Thumbnail_url='//images.travelnow.com'+ThumbnailURL;	
			map.setCenter(new google.maps.LatLng(lat,longi));
			boxTextVal="";
			marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, longi),
			map: map,
			draggable : false,
			icon :"images/"+StarRatingMarker+"-marker.png"
		});

		var boxText = document.createElement("div");
		
		boxText.className = "boxelement";

		boxTextVal += '<div class="gmapta"><table width="100%" border="0" cellspacing="0" cellpadding="0">';
		boxTextVal += '<caption>';
		boxTextVal += 'Click marker above to see prices and availability';
		boxTextVal += '</caption>';
		boxTextVal += '<tr>';
		boxTextVal += '<th style="padding:0px;width:82px;vertical-align: top;"><img src="'+Thumbnail_url+'" alt="" width="80" height="80"></th>';
		boxTextVal += '<th><span style="font-weight:bold">'+hotel_name+'</span>';
		boxTextVal += '<div>'+Address1+', '+Address2+'</div>';
		boxTextVal += '<p><span class="rating-static rating-'+StarRating+'"></span></p>';
		boxTextVal += '<p class="mprice">$ '+LowRate+'</p>';
		boxTextVal += '</th>';
		boxTextVal += '</tr>';
		boxTextVal += '</table></div>';

	   boxText.innerHTML=boxTextVal;

		var myOptions = {

		content: boxText,

		disableAutoPan: false,

		maxWidth: 0,

		pixelOffset: new google.maps.Size(-140, 0),

		zIndex: 10000,

		boxStyle: { 
			background: "url('images/gmap-aro.png') 100px 7px no-repeat",
			opacity: 0.95,
			width: "360px"
		},

		closeBoxMargin: "-10px -20px -20px -20px",

		closeBoxURL: "images/1359163327_Error.png",

		infoBoxClearance: new google.maps.Size(1, 1),

		isHidden: false,
		pane: "floatPane",
		mapTypeId: 'terrain',
		enableEventPropagation: false
		};
		var ib = new InfoBox(myOptions);

		google.maps.event.addListener(marker, "mouseover", function (e) {

		if(Info_Boxes){
			for (i in Info_Boxes){
				Info_Boxes[i].setMap(null);
			}
		}
			ib.open(map, this);

		});
		google.maps.event.addListener(marker, "click", function (e) {
		 var url ="detailsPage.html?destination="+destination+"&hotel_id="+EANHotelID+"&latitude="+latitude+"&longitude="+longitude+"&checkIn="+checkIn+"&checkOut="+checkOut+"&Cri_currency=USD&Cri_language=en_US&rooms="+rooms+"&adults="+adults+"&childs="+childs+"&childAge="+childAge;	
		 mainView.router.loadPage(url);
		 
		 // window.location="/hotel-information/"+EANHotelID+"/"+hotel_name;
		});
		google.maps.event.addListener(marker, "mouseout", function (e) {
		if(Info_Boxes){
			for (i in Info_Boxes){
				Info_Boxes[i].setMap(null);
			}
		  }
		}); 
		
   if($$("#hotel_name_search").val()!=""){
			ib.open(map, marker);
	}
	Info_Boxes.push(ib);
	
	markers.push(marker);
	for (i in Info_Boxes){
		Info_Boxes[i].setMap(null);
		}
	}
   
 }
/*===== Hotel Details Page ===*/  
 if(page.name=='detailsPage')
 {
   var hotel_id =page.query.hotel_id;	 
   var destination =page.query.destination;
   var latitude =page.query.latitude;	 
   var longitude =page.query.longitude;	 
   var checkIn =page.query.checkIn;
   var checkOut =page.query.checkOut;
   var Cri_currency =page.query.Cri_currency;
   var Cri_language =page.query.Cri_language;
   var checkOut =page.query.checkOut;
   var rooms =page.query.rooms;
   var adults = page.query.adults;
   var childs = page.query.childs;
   var childAge = page.query.childAge;
    $$(".detailsPagecontent").scroll(function() {
	   console.log($$(this).scrollTop());
    if($$(this).scrollTop() > 180) {
        $$('.detailsPageeNaver').addClass('opaque');
		$$('.tab-Roomtype').addClass('fixkarde');
		$$('.Roomtypetabs').addClass('marginTopad');
    } else {
        $$('.detailsPageeNaver').removeClass('opaque');
		$$('.tab-Roomtype').removeClass('fixkarde');
		$$('.Roomtypetabs').removeClass('marginTopad');
    }
	});
	
   var backLink ='search-results.html?destination='+destination+'&latitude='+latitude+'&longitude='+longitude+'&checkIn='+checkIn+'&checkOut='+checkOut+'&Cri_currency='+Cri_currency+'&Cri_language='+Cri_language+'&hotelType=1&rooms='+rooms+'&adults='+adults+'&childs='+childs+'&childAge='+childAge;
   
   $$('.backLink').attr('href',backLink);
   
   var param ={actionType:'Hotel_Description',hotel_id:hotel_id};
   
   $$.get(RequestURL+'/update_rates.php',param, function (response,status) {
	 if(status==200){
	   var myData =JSON.parse(response);
	   var HotelInformationResponse =myData.HotelInformationResponse;
	   var HotelSummary =HotelInformationResponse.HotelSummary;
	   var HotelDetails =HotelInformationResponse.HotelDetails;
	   var PropertyAmenities =HotelInformationResponse.PropertyAmenities.PropertyAmenity;
	   var HotelImages =HotelInformationResponse.HotelImages.HotelImage[0].url;
	   var hotelRating =HotelSummary.hotelRating.toString();
	       hotelRating =hotelRating.replace('.','-');
	  
	   var PropertyAmenityHtml ='';
	   $$.each(PropertyAmenities, function( key, value ) {
		  PropertyAmenityHtml+='<li><span class="chkClass"><i class="fa fa-check" aria-hidden="true"></i></span>'+value.amenity+'</li>';
		});

	   var HTML =''; 
	    HTML+='<div class="card ft-detail-header-img">'+
		'<div style="background-image:url('+HotelImages+')" valign="bottom" class="card-header color-white no-border">'+
			'<div class="topTiteldep">'+
				'<p class="topTiteldep1">'+HotelSummary.lowRate+'</p>'+
				'<p class="topTiteldep2">'+HotelSummary.name+'</p>'+
				'<p class="topTiteldep3 ratings icons_strall str_'+hotelRating+'"></p>'+
			'</div>'+
			'</div>'+
		
				'<div class="tab-Roomtype">'+
					'<a href="#" data-tab="#tab-1" class="tab-link">Description</a>'+
					'<a href="#" data-tab="#tab-2" class="tab-link">Reviews</a>'+
					'<a href="#" data-tab="#tab-3" class="tab-link">Map</a>'+
					'</div>	'+
					'<div class="tabs Roomtypetabs">'+
					'<div class="tab active" id="tab-1">'+
					'<div class="DivAmen">'+
						'<div class="form_title">'+
							   ' <h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>Property Amenities</h3>'+
							   ' <p class="">Property Amenities</p>'+
						   ' </div>'+
					'<div class="step">'+
						'<ul class="float-left-property-Amenity">'+PropertyAmenityHtml+'</ul>'+
					'</div>'+
					'</div>'+
					
					'<div class="DivAmen">'+
						'<div class="form_title">'+
							   ' <h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>CheckIn Instructions</h3>'+
							   ' <p class="">CheckIn Instructions</p>'+
						   ' </div>'+
					'<div class="step">'+
						'<p class="stepPragf">'+HotelDetails.checkInInstructions+'<br></p>'+
					'</div>'+
					'</div>'+
					'<div class="DivAmen">'+
						'<div class="form_title">'+
							   ' <h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>Special CheckIn Instructions</h3>'+
							   ' <p class="">Special CheckIn Instructions</p>'+
						   ' </div>'+
					'<div class="step">'+
						'<p class="stepPragf">'+HotelDetails.specialCheckInInstructions+'<br></p>'+
					'</div>'+
					'</div>'+
					'<div class="DivAmen">'+
						'<div class="form_title">'+
							   ' <h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>Point of Interest</h3>'+
							   ' <p class="">Point of Interest</p>'+
						   ' </div>'+
					'<div class="step">'+
						'<p class="stepPragf">'+ HotelDetails.areaInformation +' <br></p>'+
					'</div>'+
					'</div>'+
					'<div class="DivAmen">'+
						'<div class="form_title">'+
							   ' <h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>Property Information</h3>'+
							   ' <p class="">Property Information</p>'+
						   ' </div>'+
					'<div class="step">'+
						'<p class="stepPragf">'+HotelDetails.propertyInformation+'<br></p>'+
					'</div>'+
					'</div>'+
					
					'<div class="DivAmen">'+
						'<div class="form_title">'+
							   ' <h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>Property Description</h3>'+
							   ' <p class="">Property Description</p>'+
						   ' </div>'+
					'<div class="step">'+
						'<p class="stepPragf">'+HotelDetails.propertyDescription+'<br></p>'+
					'</div>'+
					'</div>'+
					
					'</div>'+
					
					'<div class="tab" id="tab-2">'+
						'<div class="mainDivImg">'+
						'<div class="DivAmen">'+
						'<div class="form_title">'+
							   '<h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>TripAdvisor Reviews</h3>'+
							   ' <p class="">TripAdvisor Reviews</p>'+
						   ' </div>'+
					'<div class="step">'+
						'<div id="tripAdvisorRating"></div>'+
					'</div>'+
					'</div>'+
						
						
						'<div class="mainDivImgleft">'+
						
					'</div>'+
					'<div class="mainDivImgright">'+
						
						
					'</div>'+
						
					'</div>'+
					
					'</div>'+
					'<div class="tab" id="tab-3">'+
					'<div class="mapDesPage">'+
						'<iframe frameborder="0" width="100%" height="480" src="scripts-libraries/search-result-google-map.php?lat='+HotelSummary.latitude+'&amp;long='+HotelSummary.longitude+'"></iframe>'+
					'</div>'+
					'</div>'+
					'</div>	'+
				
			'<div class="card-content card-contentnotusedispaylnone">'+
				'<div class="card-content-inner">'+
				  '<div class="item-title TitleRelease">'+HotelSummary.name+'</div>'+
				  
				  '<div class="content-block-title content-block-margin ratings icons_strall str_'+HotelSummary.hotelRating+'"></div>'+
				  '<div class="color-gray">'+HotelSummary.address1+', '+HotelSummary.city+', '+HotelSummary.countryCode+'</div>'+
				  
				  '<div class="item-subtitle">'+HotelSummary.tripAdvisorReviewCount+' reviews</div>'+
				'</div>'+
			  '</div>'+
				
				'<div class="HotelOverview card-contentnotusedispaylnone">'+
				  '<div class="content-block">'+
					'<div class="content-block-title OverviewdetailsPagetitle">Hotel Overview</div>'+
					 '<p href="#" class="detailsPagecontentpr">'+HotelDetails.propertyInformation+'</p>'+
					  '<a href="#" class="detailsPagecontentprad">READ MORE</a>'+
					  '</div>'+
					'</div>'+
					'<div class="content-block content-block2 card-contentnotusedispaylnone">'+
					'<div class="detailsPageMap">'+
						 '<img src="img/mapImage.jpg" width="100%" class="lazy lazy-fadeIn">'+
					'</div>'+
					'</div>'+
					'<div class="content-block card-contentnotusedispaylnone">'+
					'<div class="content-block-title OverviewdetailsPagetitle">Check In Instructions</div>'+
					 '<p href="#" class="detailsPagecontentpr">'+HotelDetails.checkInInstructions+'</p>'+
					'</div>'+
					'</div>'+
					'<div class="content-block card-contentnotusedispaylnone">'+
					'<div class="content-block-title OverviewdetailsPagetitle">Special Check In Instructions</div>'+
					 '<p href="#" class="detailsPagecontentpr">'+HotelDetails.specialCheckInInstructions+'</p>'+
					'</div>'+
					'<div class="content-block content-block3 card-contentnotusedispaylnone" >'+
					'<div class="content-block-title OverviewdetailsPagetitleroomfess">Room Fees Description</div>'+
					 '<p class="detailsPagecontentpr">'+HotelDetails.roomFeesDescription+'</p>'+
					'</div>'+
					'</div>'+
					'<div class="content-block content-block4 card-contentnotusedispaylnone">'+
					'<div class="content-block-title OverviewdetailsPagetitleroomfess">PropertyAmenity</div>'+
					 '<ul class="PropertyAmenityHtmlli">'+PropertyAmenityHtml+'</ul>'+
					'</div>'+
					'</div>'+
					
					
					'<div class="NearbyLandmarks card-contentnotusedispaylnone">'+
						  '<div class = "content-block-title nearbyTitle">Point of Interest</div>'+
							 '<div class="content-block ContenHotelDetails">'+ HotelDetails.areaInformation +
								
							 '</div>'+
					'</div>'+
					'<div class="HotelPolicies card-contentnotusedispaylnone">'+
					 '<div class="card-content-inner">'+
					  '<div class="data-table-title hotel-policies-title">Hotel Policies</div>'+
						'<div class="row">'+
							'<a href="" class="col-25">'+
								'<div class="HotelPolicies-check">Check-In</div>'+
								'<div class="HotelPolicies-check-Time">01:00 PM</div>'+
							'</a>'+
							'<a href="" class="col-25">'+
								'<div class="HotelPolicies-check">Check-Out</div>'+
								'<div class="HotelPolicies-check-Time">12:00 PM</div>'+
							'</a>'+

							'<a href="" class="col-25">'+
								'<div class="HotelPolicies-check">Floors</div>'+
								'<div class="HotelPolicies-check-Time">3</div>'+
							'</a>'+
							'<a href="" class="col-25">'+
								'<div class="HotelPolicies-check">Rooms</div>'+
								'<div class="HotelPolicies-check-Time">59</div>'+
							'</a>'+
						'</div>'+
						'</div>'+
					'</div>'+
			'</div>';
			
		 '<div class="card Check-In-Cardout">'+
		  '<div class="row">'+
			'<div  href="" class="col-75">'+
				'<div class="row">'+
				'<div  href="" class="col-50">'+
					'<div class="HotelPolicies-check">Check-In</div>'+
					'<div class="HotelPolicies-check-Time">Nov 19, Sun</div>'+
				'</div>'+
				'<div  href="" class="col-50">'+
					'<div class="HotelPolicies-check">Check-Out</div>'+
					'<div class="HotelPolicies-check-Time">Nov 19, Sun</div>'+
				'</div>'+
				'</div>'+
			'</div>'+
			'<div  href="" class="col-25">'+
				'<div class="HotelPolicies-check">3 Rooms</div>'+
				'<div class="HotelPolicies-check-Time">7 Guests</div>'+
			'</div>'+
		  '</div>'+
		'</div>'
      $$('.detailsPagecontent').html(HTML);
	  $$('#startPrice').html(HotelSummary.lowRate);
	  
	  var selectRoomsLink ='select-rooms.html?destination='+destination+'&hotel_id='+hotel_id+'&latitude='+latitude+'&longitude='+longitude+'&checkIn='+checkIn+'&checkOut='+checkOut+'&Cri_currency='+Cri_currency+'&Cri_language='+Cri_language+'&rooms='+rooms+'&adults='+adults+'&childs='+childs+'&childAge='+childAge+'&hotelRating='+HotelSummary.hotelRating;
	  
	  $$('#selectRoomLink').attr('href',selectRoomsLink);
	  
		
	 } 
	 
	});
	
	/*=== TripAdvisor ===*/
   var param ={actionType:'TripAdvisor_Rating',Cri_language:Cri_language,hotel_id:hotel_id};
   $$.get(RequestURL+'/update_rates.php',param, function (response,status) {
	  $$('#tripAdvisorRating').html(response); 
   });
	
}

/*===== Select Room Page ===*/  
if(page.name=='select-rooms'){
   var hotel_id =page.query.hotel_id;	 
   var destination =page.query.destination;
   var latitude =page.query.latitude;	 
   var longitude =page.query.longitude;	 
   var checkIn =page.query.checkIn;
   var checkOut =page.query.checkOut;
   var Cri_currency =page.query.Cri_currency;
   var Cri_language =page.query.Cri_language;
   var checkOut =page.query.checkOut;
   var rooms =page.query.rooms;
   var adults = page.query.adults;
   var childs = page.query.childs;
   var childAge = page.query.childAge;
   var hotelRating =page.query.hotelRating;
   var backLink ='detailsPage.html?destination='+destination+'&hotel_id='+hotel_id+'&latitude='+latitude+'&longitude='+longitude+'&checkIn='+checkIn+'&checkOut='+checkOut+'&Cri_currency='+Cri_currency+'&Cri_language='+Cri_language+'&rooms='+rooms+'&adults='+adults+'&childs='+childs+'&childAge='+childAge;
   $$('.backLink').attr('href',backLink);
   var param ={actionType:'RoomAvailability', hotel_id: hotel_id,destination:destination,latitude:latitude,longitude:longitude,checkIn: checkIn,checkOut: checkOut,Cri_currency: Cri_currency,Cri_language: Cri_language, rooms: rooms,adults: adults,childs: childs,childAge: childAge,hotelRating:hotelRating};
    $$.get(RequestURL+'/update_rates.php', param, function (data) {
	 if (data!='') {
	  RoomAvailability(data,param);
	 }
	});					
}	


/*===== Hotel Online booking Page ===*/  
if(page.name=='online-booking'){
   var destination =page.query.destination;	
   var hotel_id =page.query.hotel_id;
   var rateCode =page.query.rateCode;   
   var destination =page.query.destination;
   var latitude =page.query.latitude;	 
   var longitude =page.query.longitude;	 
   var checkIn =page.query.checkIn;
   var checkOut =page.query.checkOut;
   var Cri_currency =page.query.Cri_currency;
   var Cri_language =page.query.Cri_language;
   var rooms =page.query.rooms;
   var adults = page.query.adults;
   var childs = page.query.childs;
   var childAge = page.query.childAge;
   var hotelRating =page.query.hotelRating;
   
   var backLink ='select-rooms.html?destination='+destination+'&hotel_id='+hotel_id+'&latitude='+latitude+'&longitude='+longitude+'&checkIn='+checkIn+'&checkOut='+checkOut+'&Cri_currency='+Cri_currency+'&Cri_language='+Cri_language+'&rooms='+rooms+'&adults='+adults+'&childs='+childs+'&childAge='+childAge+'&hotelRating='+hotelRating;
   
   $CardTypes ='<option value="AX">American Express</option><option value="BC">BC Card</option><option value="DC">DINERS CLUB INTERNATIONAL</option><option value="DS">Discover</option><option value="JC">JCB</option><option value="CA" selected="selected">Master Card</option><option value="VI">Visa</option>';
   
   var param ={actionType:'RoomAvailability',
	            hotel_id: hotel_id,
				checkIn: checkIn,
	            checkOut: checkOut,
			    Cri_currency: Cri_currency,
				Cri_language: Cri_language,
			    rooms: rooms,
			    adults: adults,
			    childs: childs,
			    childAge: childAge};
				
	$html ='';
	$$.get(RequestURL+'/update_rates.php', param, function (data) {	
	 if (data!='') {
	   var response =JSON.parse(data);
	   $HotelRoomAvailabilityResponse =response.HotelRoomAvailabilityResponse;
	   $HotelDetails = response.HotelRoomAvailabilityResponse.HotelDetails;
	   $HotelImages =response.HotelRoomAvailabilityResponse.HotelImages.HotelImage[0].url;
	   $arrivalDate =$HotelRoomAvailabilityResponse.arrivalDate;
	   $departureDate =$HotelRoomAvailabilityResponse.departureDate;
	   
	   $HotelRooms =Array();
	   if($HotelRoomAvailabilityResponse.size>1){
	    $HotelRooms =$HotelRoomAvailabilityResponse.HotelRoomResponse;
	   }else{
		$HotelRooms[0] =$HotelRoomAvailabilityResponse.HotelRoomResponse;   
	   }
	   
	   
	   var matchedRoom =Array();
	   for(var i=0; i<$HotelRooms.length;i++){
		 if(rateCode==$HotelRooms[i].rateCode){
		   matchedRoom =$HotelRooms[i];	 
		 }
	   }
	   
	   $supplierType =matchedRoom.supplierType;
	   $BedTypes =matchedRoom.BedTypes;
	   
	   $BedTypeStr='';
	   if($BedTypes.size>1){
		 for(var b=0;b<$BedTypes.size;b++){
		 $BedTypeStr+='<option value="'+$BedTypes.BedType[b].id+'">'+$BedTypes.BedType[b].description+'</option>';
		 }
	    }
	   else{$BedTypeStr='<option value="'+$BedTypes.BedType.id+'">'+$BedTypes.BedType.description+'</option>';}
	  
	   
	   $smokingPreferences =matchedRoom.smokingPreferences;
	   $smokingPreferencesStr ='';
	   if(typeof $smokingPreferences!='undefined'){
		 var smokings = $smokingPreferences.split(",");  
		 for(var s=0;s<smokings.length;s++){
		   $smokingPreferencesStr+='<option Value="'+smokings[s]+'">'+smokings[s]+'</option>';	 
		 }
	   }
	   
	   $RateInfo =Array();
	   if(matchedRoom.RateInfos.size>1){
	    $RateInfo =matchedRoom.RateInfos.RateInfo;
	   }else{
		$RateInfo[0]=matchedRoom.RateInfos.RateInfo;   
	   }
	   
	   $RateInfoObj =$RateInfo[0];
	   
	   $ValueAdds =Array();
	   //console.log($HotelRooms);
	   if(typeof matchedRoom.ValueAdds!='undefined'){
		   if(matchedRoom.ValueAdds.size>1){
			$ValueAdds =matchedRoom.ValueAdds.ValueAdd;
		   }else{
			$ValueAdds[0]=matchedRoom.ValueAdds.ValueAdd;   
		   }
	   } 
	   
	   $ChargeableRateInfo =$RateInfoObj.ChargeableRateInfo;
	   $Surcharges =Array();
	   if($ChargeableRateInfo.Surcharges.size>1){
		$Surcharges =$ChargeableRateInfo.Surcharges.Surcharge;
	   }else{
		 $Surcharges[0] =$ChargeableRateInfo.Surcharges.Surcharge; 
	   }
	   
	   $SurchargeHtml='';
	   for(var s=0;s<$Surcharges.length;s++){
		$SurchargeHtml+='<div class="row"><div class="col-50"><p class="Tariff-DetailsTitle">'+$Surcharges[s].type+'</p></div><div class="col-50"> <p class="Tariff-DetailsPrice">$'+$Surcharges[s].amount+'</p></div></div>';
	   }
	   
	   $cancellationPolicy =$RateInfoObj.cancellationPolicy;
	   $nonRefundable =$RateInfoObj.nonRefundable;
	   if($nonRefundable==1){$nonRefundable=true;}
	   else{$nonRefundable=false;}
	   $promoDescription =$RateInfoObj.promoDescription;
	   
	   var $ValueAddsHtml='';
	   if(typeof $ValueAdds!='undefined'){
		   for(var v=0; v <$ValueAdds.length; v++){
			$ValueAddsHtml+='<p>'+$ValueAdds[v].description+'</p>';	  
		   }
	   }
	
       var start_year = new Date().getFullYear();
       $ExpiryYear ='';	   
	   for (var i = start_year; i < start_year + 10; i++) {
		$ExpiryYear+='<option value="' + i + '">' + i + '</option>';
	  }
	  
	   $html+='<div class="margin_reviewPage">'+
				'<div class="card-content">'+
					'<div class="card-content-inner">'+
						'<div class="item-title TitleRelease">'+$HotelRoomAvailabilityResponse.hotelName+'</div>'+
						'<div class="content-block-title content-block-marginder ratings icons_strall str_'+$HotelRoomAvailabilityResponse.tripAdvisorRating+'"></div>'+
						'<p class="color-gray color-graypadeins color1">'+$HotelRoomAvailabilityResponse.hotelAddress+','+$HotelRoomAvailabilityResponse.hotelCity+','+$HotelRoomAvailabilityResponse.hotelCountry+'</p>'+
						'<div class="row review-hotel-detailsPage boderrow">'+
                    '<a href="box.html" class="col-33">'+
                        '<div class="BoxPageLoc color-gray">Check-In</div>'+
                        '<div class="BoxPagebold color-black">'+$HotelRoomAvailabilityResponse.arrivalDate+'</div>'+
                    '</a>'+
                    '<a href="box.html" class="col-33 boxPagebrightnessIcons">'+
                        '<div class="BoxPageLoc color-gray"><i class="material-icons"> brightness_3</i></div>'+
                        '<div class="BoxPageLoc color-gray">New Delhi</div>'+
                   '</a>'+
                    '<a href="box.html" class="col-33">'+
                        '<div class="BoxPageLoc color-gray floatbox">Check-Out</div>'+
                        '<div class="BoxPagebold color-black floatbox">'+$HotelRoomAvailabilityResponse.departureDate+'</div>'+
                    '</a>'+
                '</div>'+
						
				'</div>'+
				
			  '</div>'+
			 '<div class="card-content-inner paddingcontent">'+
			 '<div class="card-header card-headerPricing"> Room Details</div>'+
			 '<a href="#" class="link inclusionsPolc open-popup" data-popup=".popup-inclusionPolicy">INCLUSIONS & POLICY</a>'+
					  '<p class="card-header-Title color-gray">'+matchedRoom.rateDescription+'</p>'+
					  '<p class="color-gray 3Rooms-rev borderbottom paddingcontent1">'+$HotelRoomAvailabilityResponse.numberOfRoomsRequested+' Rooms, 7 Guests</p>'+
					  
					'</div>'+
				'</div>'+
			'<div class="margin_reviewPage">'+
					'<div class="card-content-inner paddingcontent">'+
			  '<div class="card-header card-headerPricing">Pricing Details</div>'+
				'<div class="card-content Tariff-Details">'+
					'<div class="row">'+
						'<div class="col-50"><p class="Tariff-DetailsTitle color-gray">Room: 1</p></div>'+
						'<div class="col-50"> <p class="Tariff-DetailsPrice color-black1">$'+$ChargeableRateInfo.averageRate+'</p></div>'+
					'</div>'+  
			        '<div class="row">'+
						'<div class="col-50"><p class="Tariff-DetailsTitle color-gray">Total Nightly Rate</p></div>'+
						'<div class="col-50"> <p class="Tariff-DetailsPrice color-black1">$'+$ChargeableRateInfo.nightlyRateTotal+'</p></div>'+
					'</div>'+
	                 $SurchargeHtml +
					
				'</div>'+
				
				'<div class="card-content Tariff-Details Tariff-Details-border">'+
						'<div class="row">'+
						'<div class="col-50"><p class="Tariff-DetailsTitle color-gray">You Pay</p></div>'+
						'<div class="col-50"> <p class="Tariff-DetailsPrice color-black1">$'+$ChargeableRateInfo.total+'</p></div>'+
					'</div>'+
					'</div>'+
				'</div>'+
          '</div> ';
		
		
       $html+='<div class="card-content-inner booking_forminner coloumnborder">'+
	         '<form name="booking_form" id="booking_form">'+ 
			   '<input type="hidden" name="action" value="Make_Booking">'+
		       '<input type="hidden" name="is_custom" value="0">'+
		       '<input type="hidden" name="Cri_language" value="'+Cri_language+'">'+
			   '<input type="hidden" name="currency" value="'+Cri_currency+'">'+
			   '<input type="hidden" name="UserId" value="0">'+
			   '<input type="hidden" name="customerSessionId" value="'+$HotelRoomAvailabilityResponse.customerSessionId+'">'+
			   '<input type="hidden" name="hotelName" value="'+$HotelRoomAvailabilityResponse.hotelName+'">'+
			   '<input type="hidden" name="roomName" value="'+matchedRoom.rateDescription+'">'+
			   '<input type="hidden" name="hotelId" value="'+$HotelRoomAvailabilityResponse.hotelId+'">'+
			   '<input type="hidden" name="arrivaldate" value="'+$HotelRoomAvailabilityResponse.arrivalDate+'">'+
			   '<input type="hidden" name="departureDate" value="'+$HotelRoomAvailabilityResponse.departureDate+'">'+
			   '<input type="hidden" name="supplierType" value="'+matchedRoom.supplierType+'">'+
			   '<input type="hidden" name="chargeableRate" value="'+$ChargeableRateInfo.total+'">'+
			   
			   '<input type="hidden" name="roomTypeCode" value="'+matchedRoom.RoomType.roomCode+'">'+
			   '<input type="hidden" name="rateKey" value="'+$RateInfoObj.RoomGroup.Room.rateKey+'">'+
			   '<input type="hidden" name="rateCode" value="'+matchedRoom.rateCode+'">'+
			   '<input type="hidden" name="noofRooms" id="noofRooms" value="'+$HotelRoomAvailabilityResponse.numberOfRoomsRequested+'">'+
			   '<input type="hidden" name="hotelRating" id="hotelRating" value="'+hotelRating+'">'+
			   '<input type="hidden" name="hotel_img" id="hotel_img" value="'+$HotelImages+'">'+
			   '<input type="hidden" name="cancellationPolicy" id="cancellationPolicy" value="'+$cancellationPolicy+'">'+
			   '<input type="hidden" name="smokingPreference" value="'+matchedRoom.smokingPreferences+'">'+
			   '<input type="hidden" name="nonRefundable" value="'+$nonRefundable+'">'+
			   '<input type="hidden" name="hotelAddress" value="'+$HotelRoomAvailabilityResponse.hotelAddress+'">'+
			   '<input type="hidden" name="hotelCity" value="'+$HotelRoomAvailabilityResponse.hotelCity+'">'+
			   '<input type="hidden" name="hotelCountry" value="'+$HotelRoomAvailabilityResponse.hotelCountry+'">'+
			   '<input type="hidden" name="H_checkInInstructions" id="H_checkInInstructions" value="'+$HotelRoomAvailabilityResponse.checkInInstructions+'">'+
			   
			   '<input type="hidden" name="adults" value="'+adults+'">'+
			   '<input type="hidden" name="childs" value="'+childs+'">'+
			   '<input type="hidden" name="childAge" value="'+childAge+'">'+
			   
	            '<div class="DivAmen">'+
						'<div class="form_title">'+
							   ' <h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>Personal Details</h3>'+
							   
						   ' </div>'+
				'<div class="step">'+
				'<div class="row">'+
				'<div class="col-20 widthcolumn">'+
				    '<div class="item-title label">Title</div>'+
				    '<div class="item-input">'+
					  '<select name="titles_0" id="titles_0"><option value="Mr">Mr</option><option value="Ms">Ms</option><option value="Mrs">Mrs</option></select>'+
				    '</div>'+
				 '</div>'+
				'<div class="col-40 widthcolumn">'+
				   '<div class="item-title label">First Name</div>'+
				   '<div class="item-input">'+
					  '<input type="text" name="firstName_0" id="firstName_0" value="Test">'+
				   '</div>'+
				 '</div>'+
				'<div class="col-40 widthcolumn">'+
				   '<div class="item-title label">Last Name</div>'+
				   '<div class="item-input">'+
					  '<input type="text" name="lastName_0" id="lastName_0" value="Booking">'+
				   '</div>'+
				'</div>'+
				'</div>'+
				'<div class="row">'+
				'<div class="col-35 widthcolumn">'+
				    '<div class="item-title label">Bed Type</div>'+
				    '<div class="item-input">'+
					  '<select name="bedTypeId" id="bedTypeId">'+$BedTypeStr+'</select>'+
				    '</div>'+
				 '</div>'+
				'<div class="col-65 widthcolumn">'+
				   '<div class="item-title label">Smoking Preferences</div>'+
				   '<div class="item-input">'+
					  '<select name="smokingPreference" id="smokingPreference">'+$smokingPreferencesStr+'</select>'+
				   '</div>'+
				 '</div>'+
				'</div>'+
				'</div>'+
				'<div class="DivAmen">'+
						'<div class="form_title">'+
							   ' <h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>Payment Details</h3>'+
							   
						   ' </div>'+
				'<div class="step">'+
				'<div class="row">'+
				'<div class="col-50 widthcolumn">'+
				    '<div class="item-title label">Cardholder FirstName</div>'+
				    '<div class="item-input">'+
					  '<input type="text" name="creditCardFirstName" id="creditCardFirstName" value="Test">'+
				    '</div>'+
				 '</div>'+
				'<div class="col-50 widthcolumn">'+
				   '<div class="item-title label">Cardholder LastName</div>'+
				   '<div class="item-input">'+
					  '<input type="text" name="creditCardLastName" id="creditCardLastName" value="Booking">'+
				   '</div>'+
				 '</div>'+
				'</div>'+
				
				'<div class="row">'+
					'<div class="col-50 widthcolumn">'+
					   '<div class="item-title label">Card Type</div>'+
					   '<div class="item-input">'+
						  '<select name="creditCardType" id="creditCardType">'+$CardTypes+'</select>'+
					   '</div>'+
					'</div>'+
				'<div class="col-50 widthcolumn">'+
				    '<div class="item-title label">Card Number</div>'+
				    '<div class="item-input">'+
					  '<input type="text" name="creditCardNumber" id="creditCardNumber" value="5401999999999999">'+
				    '</div>'+
				 '</div>'+
				 '</div>'+
				 '<div class="row">'+
				'<div class="col-50 widthcolumn">'+
				   '<div class="item-title label">Expiration Month</div>'+
				   '<div class="item-input">'+
					  '<select class="form-element" name="creditCardExpirationMonth" id="creditCardExpirationMonth"><option value="01">01-January</option><option value="02">02-February</option><option value="03">03-March</option><option value="04">04-April</option><option value="05">05-May</option><option value="06">06-June</option><option value="07">07-July</option><option value="08">08-August</option><option value="09">09-September</option><option value="10">10-October</option><option value="11">11-November</option><option value="12">12-December</option></select>'+
				   '</div>'+
				 '</div>'+
				'<div class="col-50 widthcolumn">'+
				   '<div class="item-title label">Expiration Year</div>'+
				   '<div class="item-input">'+
					  '<select class="form-element" name="creditCardExpirationYear" id="creditCardExpirationYear">'+$ExpiryYear+'</select>'+
				   '</div>'+
				'</div>'+
				'</div>'+
				
				'<div class="row">'+
				'<div class="col-50 widthcolumn">'+
				    '<div class="item-title label">Security Code (CCV)</div>'+
				    '<div class="item-input">'+
					  '<input type="text" name="creditCardIdentifier" id="creditCardIdentifier" value="123">'+
				    '</div>'+
				 '</div>'+
				 '</div>'+
				 '</div>'+
				 '<div class="DivAmen">'+
						'<div class="form_title">'+
							   ' <h3 class=""><strong><i class="fa fa-check" aria-hidden="true"></i></strong>Address Details</h3>'+
							   
						   ' </div>'+
				'<div class="step">'+
				 '<div class="row">'+
				 '<div class="col-50 widthcolumn">'+
				    '<div class="item-title label">Country</div>'+
				    '<div class="item-input">'+
					  '<select name="countryCode" id="countryCode"><option value="">Select</option><option value="US" selected="selected">United States</option><option value="IN">India</option></select>'+
				    '</div>'+
				 '</div>'+
				'</div>'+
				
				'<div class="row">'+
				'<div class="col-100 widthcolumn">'+
				   '<div class="item-title label">Postal / Zip Code <span class="weli_use">(We’ll use this to verify your credit card details)</span></div>'+
				   '<div class="item-input">'+
					  '<input type="text" name="postalCode" id="postalCode" value="98004">'+
				   '</div>'+
				 '</div>'+
				'</div>'+
				
				'<div class="row">'+
				'<div class="col-50 widthcolumn">'+
				    '<div class="item-title label">Address</div>'+
				    '<div class="item-input">'+
					  '<input type="text" name="address1" id="address1" value="travelnow">'+
				    '</div>'+
				 '</div>'+
				'<div class="col-50 widthcolumn">'+
				   '<div class="item-title label">City</div>'+
				   '<div class="item-input">'+
					  '<input type="text" name="city" id="city" value="Seattle">'+
				   '</div>'+
				 '</div>'+
				 '</div>'+
				 '<div class="row">'+
				 '<div class="col-50 widthcolumn">'+
				   '<div class="item-title label">State</div>'+
				   '<div class="item-input">'+
					  '<select type="text" name="stateProvinceCode" id="stateProvinceCode"><option value="AL">Alabama</option></select>'+
				   '</div>'+
				 '</div>'+
				'<div class="col-50 widthcolumn">'+
				    '<div class="item-title label">Email Address</div>'+
				    '<div class="item-input">'+
					 '<input type="text" name="email_id" id="email_id" value="support@thewebconz.com">'+
				    '</div>'+
				 '</div>'+
				 '</div>'+
				 '<div class="row">'+
				'<div class="col-50 widthcolumn">'+
				   '<div class="item-title label">Confirm Email Address</div>'+
				   '<div class="item-input">'+
					  '<input type="text" name="email_id_2" id="email_id_2" value="support@thewebconz.com">'+
				   '</div>'+
				 '</div>'+
				 
				 '<div class="col-50 widthcolumn">'+
				   '<div class="item-title label">Telephone Number</div>'+
				   '<div class="item-input">'+
					  '<input type="text" name="homePhone" id="homePhone" value="9540121212">'+
				   '</div>'+
				 '</div>'+
				'</div>'+
				'</div>'+
	          '</form></div>';
		
		$html+='<div class="popup popup-inclusionPolicy" >'+
				'<div class="content-block popup-inclusionPolicyblock">'+
				 
				  '<h2>INCLUSIONS</h2>'+
				  $ValueAddsHtml+
				  '<h2>Decription</h2>'+
				  '<p>'+matchedRoom.RoomType.descriptionLong+'</p>'+
				  '<h2>CancellationPolicy</h2>'+
				  '<p>'+$cancellationPolicy+'</p>'+
				   
				'</div>'+
				'<p class="close-popup-ioncsfa"><a href="#" class="close-popup">Got It</a></p>'+
			  '</div>';	 
		  
	  $$('#onlinePageData').html($html);
	  $$('#totalAmount').html('$'+$ChargeableRateInfo.total);
	  $$('.backLink').attr('href',backLink);
	 }
   });
   
   /*===Booking ===*/
   $$('.finalBookingBtn').on('click', function (e) {
	   e.preventDefault();
	   myApp.showIndicator();
	  var formData = myApp.formToData('#booking_form');
      $$.get(RequestURL+'/final-booking.php', formData, function (data) {	
	      myApp.hideIndicator();
	      $response = data.split("~");
		  $flag =$response[0];
		  $val =$response[1];
		  if($flag==0){
			myApp.popup('<div class="popup"><a href="#" class="close-popup">close me</a><div class="message">'+$val+'</div></div>', true);  
		  }else{alert('');
			  mainView.router.loadPage("confirmation.html?itineraryId="+$val);
		  }
	  });
	  
   });
}

/*===== Confirmation Page ===*/  
if(page.name=='confirmation'){
  var itineraryId =page.query.itineraryId;
  var param ={actionType:'Confirmation',itineraryId:itineraryId};
  $$.get(RequestURL+'/update_rates.php', param, function (data) {
	  $response =JSON.parse(data);
	  html ='<div class="page-contentconfirmation-page-conten">'+
				'<div class="box-shadow1">'+
				'<div class="card-content">'+
					'<div class="card-content-inner card1" style="position:unset;" >'+
						'<div class="item-title TitleRelease">'+$response.hotelName+'</div>'+
						'<div class="content-block-title content-block-margin ">'+$response.hotelRating+'</div>'+
						'<p class="color-gray">'+$response.hotelAddress+','+$response.hotelCity+','+$response.hotelCountry+'</p>'+
					'</div>'+
				'</div>'+
				'<div class="card-content-inner" style="position:unset;">'+
				'<div class="row review-hotel-detailsPage boderrow">'+
                    '<a href="#" class="col-33">'+
                        '<div class="BoxPageLoc color-gray">Check-In</div>'+
                        '<div class="BoxPagebold color-black">'+$response.check_in+'</div>'+
                    '</a>'+
                    '<a href="#" class="col-33 boxPagebrightnessIcons">'+
                        '<div class="BoxPageLoc"><i class="material-icons"> brightness_3</i></div>'+
                        '<div class="BoxPagebold color-gray">New Delhi</div>'+
                   '</a>'+
                    '<a href="#" class="col-33">'+
                        '<div class="BoxPageLoc color-gray">Check-Out</div>'+
                        '<div class="BoxPagebold color-black">'+$response.check_out+'</div>'+
                    '</a>'+
                '</div>'+
			  '</div>'+
			  '<div class="card-header card-headerPricing" style="padding-left: 16px;">Booking Details</div>'+
			 '<div class="confirmation_Tariff-Details">'+
					'<div class="row row-inner">'+
					  '<div class="col-50 row-inner1">'+
					  '<p class="card-header-Title confirmation-DetailsTitle">ItineraryId: </p>'+
					  '</div>'+
					  '<div class="col-50">'+
					  '<p class="card-header-Title confirmation-DetailsPrice">'+$response.itineraryId+'</p>'+
					 '</div>'+
					  '</div>'+
					  '<div class="row row-inner">'+
					  '<div class="col-50 row-inner1">'+
					  '<p class="card-header-Title confirmation-DetailsTitle">confirmationNumbers: </p>'+
					  '</div>'+
					  '<div class="col-50">'+
					  '<p class="card-header-Title confirmation-DetailsPrice">'+$response.confirmationNumbers+'</p>'+
					 '</div>'+
					  '</div>'+
					  '<div class="row row-inner">'+
					  '<div class="col-50 row-inner1">'+
					  '<p class="card-header-Title confirmation-DetailsTitle">Status: </p>'+
					  '</div>'+
					  '<div class="col-50">'+
					  '<p class="card-header-Title confirmation-DetailsPrice">'+$response.booking_status+'</p>'+
					 '</div>'+
					  '</div>'+
					  
					'</div>'+
					
					
					
				'</div>'+
			
					
			  
				
				'</div>'+
				'</div>'+
          '</div> ';
		$$('#confirmationPageData').html(html);
  });
}	



function RoomAvailability(data,paramData){ 
 var response =JSON.parse(data);
 $Room_Details =Array();
 $Room_size =response.HotelRoomAvailabilityResponse.size
 if($Room_size>1){
  $Room_Details = response.HotelRoomAvailabilityResponse.HotelRoomResponse; 
 }else{
  $Room_Details[0] = response.HotelRoomAvailabilityResponse.HotelRoomResponse;
 }

 $html ='';
 if($Room_size>0){
   for(var i=0; i<$Room_size;i++){
	//$RoomImage_size =$Room_Details[i].RoomImages.size;
	$rateCode =$Room_Details[i].rateCode;
	$rateDescription =$Room_Details[i].rateDescription;
	$RoomType =$Room_Details[i].RoomType;
	
	$RoomImage =$Room_Details[i].RoomImages.RoomImage[0].url;
	$RateInfos =$Room_Details[i].RateInfos;
	$RateInfo =Array();
	if($RateInfos.size>1){$RateInfo =$RateInfos.RateInfo;}
	else{ $RateInfo[0] =$RateInfos.RateInfo;}
	
	$RateInfoObj =$RateInfo[0];
	$ChargeableRateInfo =$RateInfoObj.ChargeableRateInfo;
	
	$BedTypes =$Room_Details[i].BedTypes;
	$Bsize = $BedTypes.size;
	$BedTypeStr='';
	if($Bsize>1){
	  for(var b=0; b<$Bsize;b++){	
	   $BedTypeStr+=$BedTypes.BedType[b].description+',';
	  }	  
	}else{
	  $BedTypeStr=$BedTypes.BedType.description;	
	}
	
	if($RateInfoObj.nonRefundable==0){$Refundable ='Refundable';}
	else{$Refundable ='Non-Refundable';}
	
	$ValueAdds =$Room_Details[i].ValueAdds;
	$ValueAddStr='';
	if (typeof $ValueAdds !== "undefined") {
	   if($ValueAdds.size>1){
		 for(var v=0; v<$ValueAdds.size;v++){
		  $ValueAddStr+='<div class="item-subtitle ResultsTetelstar_rate"><i class="material-icons">check</i>'+$ValueAdds.ValueAdd[v].description+'</div>';	 
		 }   
	   }else{
		 $ValueAddStr+='<div class="item-subtitle ResultsTetelstar_rate"><i class="material-icons">check</i>'+$ValueAdds.ValueAdd.description+'</div>';    
	   }	
	}

	$onlinePageLink ='online-booking.html?hotel_id='+paramData.hotel_id+'&rateCode='+$rateCode+'&destination='+paramData.destination+'&latitude='+paramData.latitude+'&longitude='+paramData.longitude+'&checkIn='+paramData.checkIn+'&checkOut='+checkOut+'&Cri_currency='+Cri_currency+'&Cri_language='+Cri_language+'&rooms='+rooms+'&adults='+adults+'&childs='+childs+'&childAge='+childAge+'&hotelRating='+hotelRating;
	
	
    $html+='<div class="card">'+
				  '<div class="card-content">'+
					'<div class="list-block media-list">'+
					  '<ul>'+
						'<li class="item-content">'+
						  '<div class="item-media ResultsPagehover">'+
							 '<div class="ResultsPageMaxWidth" style="background: url('+$RoomImage+') no-repeat center;">'+
								'<i class="material-icons Resultsfavorite" style="display:none;">favorite</i>'+
							 '</div>'+
						  '</div>'+
						  '<div class="item-inner">'+
							'<div class="item-title-row">'+
							  '<div class="item-title ResultsTetelHotel">'+$Room_Details[i].rateDescription+' '+$BedTypeStr+'</div>'+
							'</div>'+
						'<div class="item-subtitle ResultsTetelHotell">Max Guests:'+$Room_Details[i].rateOccupancyPerRoom+'</div>'+
							'<div class="item-subtitle ResultsTetelHotell">SmokingPreferences:'+$Room_Details[i].smokingPreferences+'</div>'+$ValueAddStr+
						
							
							
						  '</div>'+
						  
						  '<div class="item-innerPrices">'+
							  '<div class="itemTitel12">$'+$ChargeableRateInfo.averageBaseRate+'</div>'+
							  '<div class="itemTitel24price">$'+$ChargeableRateInfo.averageRate+'</div>'+
							  '<div class="itemTitel6room">'+$RateInfoObj.currentAllotment+'&nbsp;rooms left</div>'+
						  '</div>'+
						'</li>'+
					'</ul>'+
					'</div>'+
				  '</div>'+
				   '<div class="card-footer SelectRoomPageOver">'+
					  '<a href="#" data-popover=".popover-roomOverview-'+$rateCode+'" class="button open-popover">Room overview </a>'+
					  '<a href="#" data-popover=".popover-cancellation-'+$rateCode+'" class="button open-popover">Cancellation policy</a>'+
					  '<a href="'+$onlinePageLink+'" class="button bookBtnsel">BOOK NOW</a>'+
					'</div>'+
				'</div>';
       
	   $html+='<div class="popover popover-cancellation-'+$rateCode+'">'+
				'<div class="popover-angle"></div>'+
				'<div class="popover-inner">'+
				  '<div class="list-block cancellation-paragraph">'+
					$RateInfoObj.cancellationPolicy+
				  '</div>'+
				'</div>'+
			  '</div>';
	 
       $html+='<div class="popover popover-roomOverview-'+$rateCode+' ">'+
				'<div class="popover-angle"></div>'+
				'<div class="popover-inner">'+
				  '<div class="list-block cancellation-paragraph">'+
					$RoomType.descriptionLong+
				  '</div>'+
				'</div>'+
			  '</div>';	 
    }
  }
  else{
   $html='No rooms';	  
  }   
   $$('#roomLists').html($html);
} 

 
});



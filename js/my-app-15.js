// Initialize your app
var myApp = new Framework7({
    modalTitle: 'My App',
 
    // If it is webapp, we can enable hash navigation:
    pushState: true,
    material: true,
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

$$(document).on('pageInit',function(e){
  // Do something here when the page laod and initialize	
 var page =e.detail.page;

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
 }

 /*=== Hotel Search Box page ====*/ 
if(page.name=='search-hotels'){
  /* ===== Calendar ===== */
    var weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    var today =new Date();
	
	var calendarRange = myApp.calendar({
    input: '#calendar-range',
    dateFormat: 'M dd yyyy',
    rangePicker: true,
	direction: 'vertical',
	minDate: today,
	rangesClasses:'',
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
						'<div class="row">'+
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
							'<div class="col-60"> '+
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
						'<div class="row childAgeCls" id="childAgeList_'+glob+'"></div>'+
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
	 //$$('#latitude').val(dataObj.location.lat);
	 $$('#destination').val(dataObj.latinFullName);	
     $$('#selectedDest').html(dataObj.latinFullName);	 	 
     $$('#latitude').val(dataObj.location.lat);
     $$('#longitude').val(dataObj.location.lon);

	}
	
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
   if( (destination!='') && (latitude!='') && (longitude!=''))
   {
	  myApp.showIndicator();
	   
	 var param ={actionType:'findSearchKey',lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge};
	 
	 $$.get('http://twc5.com/demo/MobAppRequest/update_rates.php',param, function (response,status) {
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
	  });

     function Upldate_Rates(){ 
	     var search_Session_Id = $$('#search_Session_Id').val();
		 
		 var param ={actionType:'Upldate_Rates',search_Session_Id:search_Session_Id,lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge};
		 $$.get('http://twc5.com/demo/MobAppRequest/update_rates.php',param, function (response,status) {
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
		 $$.get('http://twc5.com/demo/MobAppRequest/update_rates.php',param, function (response,status) {
		 if(status==200){
		   	 $$('#totalrecords').val(response);
			 $$('#counthotel').html(response);
		 } 
	    });
     }
	
    function Searched_Hotels(){
	  var search_Session_Id = $$('#search_Session_Id').val();
      var sortField =$$('#sortField').val(sortField);
      var sortby = $$('#sortby').val(sortby);  	  
	  
	   var param ={actionType:'Searched_Hotels',search_Session_Id:search_Session_Id,lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge,page:1,orderby_fild:sortField,orderby_val:sortby};
	   $$.get('http://twc5.com/demo/MobAppRequest/update_rates.php',param, function (response,status) {
		 if(status==200){
		   var myData =JSON.parse(response);
		   var totalrecords =myData.totalrecords;
		   var getHotelLists=myData.result;
		    $$('#totalrecords').val(totalrecords);
			$$('#counthotel').html(totalrecords);
		   listHotelResults(getHotelLists);	  
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
   
   
   function listHotelResults(getHotelLists,page=0){
     if(getHotelLists.length>0){
		 var html=''; 
		for (var i = 0; i < getHotelLists.length; i++) {
		 html+='<li><div class="card">'+
			   '<div class="card-content">'+
			      '<div class="list-block media-list">'+
				    '<ul>'+
					'<a href="detailsPage.html?destination='+destination+'&hotel_id='+getHotelLists[i].hotelId+'&checkIn='+checkIn+'&checkOut='+checkOut+'&Cri_currency='+Cri_currency+'&Cri_language='+Cri_language+'&rooms='+rooms+'&adults='+adults+'&childs='+childs+'&childAge='+childAge+'" >'+
					'<li class="item-content">'+
					 '<div class="item-media ResultsPagehover">'+
						'<div class="ResultsPageMaxWidth" style="background: url(//images.trvl-media.com/'+ getHotelLists[i].thumbNailUrl +') no-repeat center;">'+
								'<i class="material-icons Resultsfavorite">favorite</i>'+
							'</div>'+
						    '</div>'+
						  '<div class="item-inner">'+
							'<div class="item-title-row">'+
							 '<div class="item-title ResultsTetelHotel">' + getHotelLists[i].name +'</div>'+
							'</div>'+
							'<div class="item-subtitle ResultsTetelHotell">' + getHotelLists[i].address1 +'</div>'+
							'<div class="item-subtitle ResultsTetelstar_rate"><i class="material-icons"></i>' + getHotelLists[i].hotelRating +'</div>'+
							'<div class="item-subtitle ResultsTetelReviews">'+
								'<div><img src="'+getHotelLists[i].tripAdvisorRatingUrl+'"></div> <div class="sre4pde40">'+getHotelLists[i].tripAdvisorRating+'</div> '+getHotelLists[i].tripAdvisorReviewCount+' Reviews</div>'+
						 '</div>'+
						  '<div class="item-innerPrices">'+
							  '<div class="itemTitel12">$' + getHotelLists[i].highRate +'</div>'+
							  '<div class="itemTitel24price">$' + getHotelLists[i].lowRate +'</div>'+
							 '<div class="itemTitel2Night">for 2 Nights</div>'+
							 '<div class="itemTitel6room">6rooms left</div>'+
						  '</div>'+
						'</li>'+
						'</a>'+
					'</ul>'+
					'</div>'+
				 '</div>'+
					'<div class="card-footer CardFooterMateriall">'+
					 '<a href="#" class=""><i class="material-icons">check</i>Free Cancellation</a>'+
					 '<a href="#" class=""><i class="material-icons">check</i>Free Wi-Fi</a>'+
					 '<a href="#" class=""><i class="material-icons material-iconsclear">clear</i>Free breakfast</a>'+
					'</div>'+
					 '<div class="card-footer CardFooterMaterial">'+
					 '<a href="#" class="FooterMaterialDeal">DEAL</a>'+
					  '<a href="#" class="FootFlatOff">Flat 30% off. Earn 15% in eWallte. Code HOTEL17</a>'+
					  '<a href="#" class="fooAddMore">+1More</a>'+
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
		alert(no_of_pages+'=>'+page);
		if(no_of_pages>page){
		var param ={actionType:'Searched_Hotels',search_Session_Id:search_Session_Id,lat:latitude,lon:longitude, checkIn:checkIn,checkOut:checkOut, rooms:rooms,adults:adults,childs:childs,childAge:childAge,page:page};
        $$.get('http://twc5.com/demo/MobAppRequest/update_rates.php', param, function (data) {
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
   
   var param ={actionType:'Hotel_Description',hotel_id:hotel_id};
   $$.get('http://twc5.com/demo/MobAppRequest/update_rates.php',param, function (response,status) {
	 if(status==200){
	   var myData =JSON.parse(response);
	   var HotelInformationResponse =myData.HotelInformationResponse;
	   var HotelSummary =HotelInformationResponse.HotelSummary;
	   var HotelDetails =HotelInformationResponse.HotelDetails;
	   var PropertyAmenities =HotelInformationResponse.PropertyAmenities.PropertyAmenity;
	   var HotelImages =HotelInformationResponse.HotelImages.HotelImage[0].url;
	   var PropertyAmenityHtml ='';
	   $$.each(PropertyAmenities, function( key, value ) {
		  PropertyAmenityHtml+='<li>'+value.amenity+'</li>';
		});
	   
	   var HTML =''; 
	    HTML+='<div class="card ft-detail-header-img">'+
			  '<div style="background-image:url('+HotelImages+')" valign="bottom" class="card-header color-white no-border">'+HotelSummary.lowRate+'</div>'+
			  '<div class="card-content">'+
				'<div class="card-content-inner">'+
				  '<div class="item-title TitleRelease">'+HotelSummary.name+'</div>'+
				  '<div class="color-gray">'+HotelSummary.address1+', '+HotelSummary.city+', '+HotelSummary.countryCode+'</div>'+
				  '<div class="content-block-title content-block-margin">'+HotelSummary.hotelRating+'</div>'+
				  '<div class="item-subtitle"><img src="'+HotelSummary.tripAdvisorRatingUrl+'"></div>'+
				  '<div class="item-subtitle">'+HotelSummary.tripAdvisorReviewCount+' reviews</div>'+
				'</div>'+
			  '</div>'+
				'<div class="card-footer CardFooterMaterial">'+
				  '<a href="#" class="FooterMaterialDeal">DEAL</a>'+
				  '<a href="#" class="FootFlatOff">Flat 30% off. Earn 15% in eWallte. Code HOTEL17</a>'+
				  '<a href="#" class="fooAddMore">+1More</a>'+
				'</div>'+
				'<div class="HotelOverview">'+
				  '<div class="content-block">'+
					'<div class="content-block-title">Hotel Overview</div>'+
					 '<p href="#" class="detailsPagecontentpr">'+HotelDetails.propertyInformation+'</p>'+
					  '<a href="#" class="detailsPagecontentprad">READ MORE</a>'+
					  '</div>'+
					'</div>'+
					'<div class="content-block-title">Check In Instructions</div>'+
					 '<p href="#" class="detailsPagecontentpr">'+HotelDetails.checkInInstructions+'</p>'+
					'</div>'+
					'<div class="content-block-title">Special Check In Instructions</div>'+
					 '<p href="#" class="detailsPagecontentpr">'+HotelDetails.specialCheckInInstructions+'</p>'+
					'</div>'+
					'<div class="content-block-title">Room Fees Description</div>'+
					 '<p href="#" class="detailsPagecontentpr">'+HotelDetails.roomFeesDescription+'</p>'+
					'</div>'+
					'<div class="content-block-title">PropertyAmenity</div>'+
					 '<ul>'+PropertyAmenityHtml+'</ul>'+
					'</div>'+
					'<div class="detailsPageMap">'+
						 '<img src="img/mapImage.jpg" width="100%" class="lazy lazy-fadeIn">'+
					'</div>'+
					
					'<div class="NearbyLandmarks">'+
						  '<div class = "content-block-title nearbyTitle">Point of Interest</div>'+
							 '<div class="list-block">'+ HotelDetails.areaInformation +
								'<div class = "list-block-label list-block-label-text-align">'+
									'<a href="#" data-popover=".popover-links" class="open-popover">View More</a>'+
								'</div>'+
							 '</div>'+
					'</div>'+
					'<div class="HotelPolicies">'+
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
		
	 } 
	});
 }
 
});
/*
$$(document).on('pageInit','.page[data-page="about"]',function(e){
	// Do something here when the page laod and initialize
	alert('Do something crazy');
});
*/

myApp.onPageInit('about',function(e){
 // get to database online,retrive the details from the user id
 
 
});

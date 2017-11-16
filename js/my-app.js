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
 
 /*=== Hotel Page ===*/
 
 
 
 if(page.name=='search-hotels'){
  var calendarDateFormat = myApp.calendar({
    input: '#checkIn_date',
    dateFormat: 'mm/dd/yyyy',
	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'],
	monthPickerTemplate:'<div class="picker-calendar-month-picker"><a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a><span class="current-month-value"></span><a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a></div>',
   }); 
   
 var calendarDateFormat = myApp.calendar({
    input: '#checkOut_date',
    dateFormat: 'mm/dd/yyyy',
	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'],
	monthPickerTemplate:'<div class="picker-calendar-month-picker"><a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a><span class="current-month-value"></span><a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a></div>',
   });
   
   $$('#rooms').on('change', function () {
	  var rooms =$$(this).val();
	  var pacHtml='';
	  for(var i=0;i<rooms;i++){
		pacHtml+='<div id="packdetail_'+i+'">'+
					'<p>Rooms '+(i+1)+'<span class="deleteRooms" rel="'+i+'">[X]</span></p>'+
					'<p>Adults:<input type="number" name="adults[]" min="1" max="3" value="1"></p>'+
					'<p>Childs:<input type="number" name="childs[]" min="0" max="2" value="0"></p>'+
				 '</div>';  
	  }
	 $$('#roomspacksDetails').html(pacHtml);
	 deleteRooms();
	});
  
  function deleteRooms(){
	$$('.deleteRooms').on('click',function(){ alert('');
	 var rel =$$(this).attr('rel'); 
	 $$('#packdetail_'+rel).remove();
    })  
  }
  
  /*=== Auto suggetion ===*/
  
  var autocompleteDropdownAjax = myApp.autocomplete({
    input: '#destination',
    openIn: 'dropdown',
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
     $$('#latitude').val(value.location.lat);
     $$('#longitude').val(value.location.lon);	 
	}
   });
  
   $$('.findHotelResults').on('click', function(){
	   var formData = myApp.formToData('#searchHotel_frm');
	   myApp.formStoreData('HotelRequestData',formData);
	   var url ='search-results.html?destination='+$$('#destination').val()+'&latitude='+$$('#latitude').val()+'&longitude='+$$('#longitude').val()+'&checkIn='+$$('#checkIn_date').val()+'&checkOut='+$$('#checkOut_date').val();
	   alert(url);	
	   mainView.router.loadPage(url);
   })
  
 }
 
 if(page.name=='search-results')
 {
   var destination =page.query.destination;
   var latitude =page.query.latitude;	 
   var longitude =page.query.longitude;	 
   var checkIn =page.query.checkIn;
   var checkOut =page.query.checkOut;
   var rooms =page.query.rooms;
   var adults = page.query.adults;
   var childs = page.query.childs;
   if( (destination!='') && (latitude!='') && (longitude!='')){
	   
	 var param ={actionType:'Upldate_Rates',
	             latitude:latitude,
				 longitude:longitude,
				 checkIn:checkIn,
				 checkIn:checkIn,
				 rooms:rooms,
	            };
	 
	 myApp.showIndicator();
     $$.get('http://twc5.com/demo/MobAppRequest/update_rates.php',param, function (response,status) {
         myApp.hideIndicator(); 
		 if(status==200){ alert(response);
		   var myData =JSON.parse(response);
		   myApp.formStoreData('HotelLists',myData.HotelListResponse.HotelList.HotelSummary);
		   listHotelResults();
		 } 
     });
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
	   getHotelLists = sortJSON(getHotelLists, sortField,sortby); 
	   shortingHtml(getHotelLists);
	 }
   });
   
   function sortJSON(data, key,sortby) { 
    if(sortby=='ASC'){
	  return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
     });	
	}else{
	  return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
		return ((x > y) ? -1 : ((x < y) ? 1 : 0));
      });	
	}
    
   }
   
   function shortingHtml(getHotelLists){
	    var html=''; 
		for (var i = 0; i < getHotelLists.length; i++) {
		  html+='<li>'+
				'<a href="#" class="item-link item-content">'+
					'<div class="item-media"><img src="//images.trvl-media.com/'+ getHotelLists[i].thumbNailUrl +'" width="80" /></div>'+
					'<div class="item-inner">'+
						'<div class="item-title-row">'+
							'<div class="item-title">' + getHotelLists[i].name +'</div>'+
						'</div >'+
						'<div class="item-subtitle">'+
							'<div class="row subtitleRowtie">'+
								'<div class="col-100">'+
								'<div class="item-title"><i class="material-icons materialIconsse">location_on</i>' + getHotelLists[i].address1 +'</div>'+
								'<div class="item-title"><i class="material-icons materialIconsse">rating</i>' + getHotelLists[i].hotelRating +'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="item-subtitle item-subtitleadCss">$' + getHotelLists[i].lowRate +'</div>'+
					'</div>'+
				'</a>'+
			'</li>';	
		}
	   $$('#hotelResults ul').html(html); 
   }
   
 
   function listHotelResults(){
	var getHotelLists = myApp.formGetData('HotelLists'); 
     if(getHotelLists.length>0){
		  var html=''; 
		for (var i = 0; i < getHotelLists.length; i++) {
		  html+='<li>'+
				'<a href="#" class="item-link item-content">'+
					'<div class="item-media"><img src="//images.trvl-media.com/'+ getHotelLists[i].thumbNailUrl +'" width="80" /></div>'+
					'<div class="item-inner">'+
						'<div class="item-title-row">'+
							'<div class="item-title">' + getHotelLists[i].name +'</div>'+
						'</div >'+
						'<div class="item-subtitle">'+
							'<div class="row subtitleRowtie">'+
								'<div class="col-100">'+
								'<div class="item-title"><i class="material-icons materialIconsse">location_on</i>' + getHotelLists[i].address1 +'</div>'+
								'<div class="item-title"><i class="material-icons materialIconsse">rating</i>' + getHotelLists[i].hotelRating +'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="item-subtitle item-subtitleadCss">$' + getHotelLists[i].lowRate +'</div>'+
					'</div>'+
				'</a>'+
			'</li>';	
		}
	   $$('#hotelResults ul').html(html); 
	 } 	 
   }
   listHotelResults();
   
   /*
   var getHotelLists = myApp.formGetData('HotelLists'); 
   alert(JSON.stringify(getHotelLists));
   
   for (var i = 0; i < getHotelLists.length; i++) {
	  html += '<li><div class="item-content"><div class="item-media"><img src="//images.trvl-media.com/'+ getHotelLists[i].thumbNailUrl +'" width="100" class="lazy"></div><div class="item-inner"><div class="item-title">' + getHotelLists[i].name +'</div><div class="item-after">' + getHotelLists[i].lowRate +'</div></div></div></li>';
	}
   $$('.list-block ul').html(html);
   */
   /*
   var loading = false;
   var lastIndex = $$('.list-block li').length;
   
   var maxItems = getHotelLists.length;
   alert(maxItems);
   var itemsPerLoad = 3;
   $$('.infinite-scroll').on('infinite', function () {
	  // Exit, if loading in progress
	  if (loading) return;
	  // Set loading flag
	  loading = true;
	  // Emulate 1s loading
	  setTimeout(function () {
		// Reset loading flag
		loading = false;
		if (lastIndex >= maxItems) {
		  // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
		  myApp.detachInfiniteScroll($$('.infinite-scroll'));
		  // Remove preloader
		  $$('.infinite-scroll-preloader').remove();
		  return;
		}
		// Generate new items HTML
		var html = '';
		for (var i = lastIndex + 1; i <= lastIndex + itemsPerLoad; i++) {
		  html += '<li><div class="item-content"><div class="item-media"><img src="//images.trvl-media.com/'+ getHotelLists[i].thumbNailUrl +'" width="100" class=""></div><div class="item-inner"><div class="item-title">' + getHotelLists[i].name +'</div><div class="item-after">' + getHotelLists[i].lowRate +'</div></div></div></li>';
		}
		// Append new items
		$$('.list-block ul').append(html);
		// Update last loaded index
		lastIndex = $$('.list-block li').length;
	  }, 1000);
	});      
	*/
	
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

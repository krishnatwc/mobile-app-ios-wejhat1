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

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
 
 if(page.name=='search-results')
 {
   var html = '';	 
   var wrongData = false; 
   $$('.get-hotel-results').on('click', function() {
     myApp.showIndicator(); // show Loading Spinner
    var param ='action=Upldate_Rates';
    $$.get('http://twc5.com/demo/MobAppRequest/update_rates.php',{action:'Upldate_Rates'}, function (response,status) {
	    alert(JSON.stringify(response));
         myApp.hideIndicator(); 
		 if(status==200){
		   var myData =JSON.parse(response);
		   myApp.formStoreData('HotelLists',myData.HotelListResponse.HotelList.HotelSummary);
		 } 
    });
   });
   
   var getHotelLists = myApp.formGetData('HotelLists'); 
   alert(JSON.stringify(getHotelLists));
   
   for (var i = 0; i < getHotelLists.length; i++) {
	  html += '<li><div class="item-content"><div class="item-media"><img src="//images.trvl-media.com/'+ getHotelLists[i].thumbNailUrl +'" width="100" class="lazy"></div><div class="item-inner"><div class="item-title">' + getHotelLists[i].name +'</div><div class="item-after">' + getHotelLists[i].lowRate +'</div></div></div></li>';
	}
   $$('.list-block ul').html(html);
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

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}

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

jQuery(document).ready(function($){

	//Meta Box Options
	var open_close = $('<a href="#" style="display:block; float:right; clear:right; margin:10px;">'+EM.open_text+'</a>');
	$('#em-options-title').before(open_close);
	open_close.on('click', function(e){
		e.preventDefault();
		if($(this).text() == EM.close_text){
			$(".postbox").addClass('closed');
			$(this).text(EM.open_text);
		}else{
			$(".postbox").removeClass('closed');
			$(this).text(EM.close_text);
		} 
	});
	$(".postbox > h3").on('click', function(){ $(this).parent().toggleClass('closed'); });
	$(".postbox").addClass('closed');

	//Navigation Tabs
	$('.tabs-active .nav-tab-wrapper .nav-tab').on('click', function(){
		el = $(this);
		elid = el.attr('id');
		$('.em-menu-group').hide(); 
		$('.'+elid).show();
		$(".postbox").addClass('closed');
		open_close.text(EM.open_text);
	});
	$('.nav-tab-wrapper .nav-tab').on('click', function(){
		$('.nav-tab-wrapper .nav-tab').removeClass('nav-tab-active').blur();
		$(this).addClass('nav-tab-active');
	});
	var navUrl = document.location.toString();
	if (navUrl.match('#')) { //anchor-based navigation
		var nav_tab = navUrl.split('#').pop().split('+');
		var current_tab = 'a#em-menu-' + nav_tab[0];
		$(current_tab).trigger('click');
		if( nav_tab.length > 1 ){
			section = $("#em-opt-"+nav_tab[1]);
			if( section.length > 0 ){
				section.children('h3').trigger('click');
		    	$('html, body').animate({ scrollTop: section.offset().top - 30 }); //sends user back to current section
			}
		}
	}else{
		//set to general tab by default, so we can also add clicked subsections
		document.location = navUrl+"#general";
	}
	$('.nav-tab-link').on('click', function(){ $($(this).attr('rel')).trigger('click'); }); //links to mimick tabs
	$('input[type="submit"]').on('click', function(){
		var el = $(this).parents('.postbox').first();
		var docloc = document.location.toString().split('#');
		var newloc = docloc[0];
		if( docloc.length > 1 ){
			var nav_tab = docloc[1].split('+');
			var tab_path = nav_tab[0];
			if( el.attr('id') ){
				tab_path = tab_path + "+" + el.attr('id').replace('em-opt-','');
			}
			newloc = newloc + "#" + tab_path;
		}
		document.location = newloc;
		$(this).closest('form').append('<input type="hidden" name="tab_path" value="'+ tab_path +'" />');
	});

	//Page Options
	$('input[name="dbem_cp_events_has_archive"]').on('change', function(){ //event archives
		if( $('input:radio[name="dbem_cp_events_has_archive"]:checked').val() == 1 ){
			$('tbody.em-event-archive-sub-options').show();
		}else{
			$('tbody.em-event-archive-sub-options').hide();
		}
	}).trigger('change');
	$('select[name="dbem_events_page"]').on('change', function(){
		if( $('select[name="dbem_events_page"]').val() == 0 ){
			$('tbody.em-event-page-options').hide();
		}else{
			$('tbody.em-event-page-options').show();
		}
	}).trigger('change');
	$('input[name="dbem_cp_locations_has_archive"]').on('change', function(){ //location archives
		if( $('input:radio[name="dbem_cp_locations_has_archive"]:checked').val() == 1 ){
			$('tbody.em-location-archive-sub-options').show();
		}else{
			$('tbody.em-location-archive-sub-options').hide();
		}
	}).trigger('change');
	$('select[name="dbem_search_form_advanced_mode"]').on('change', function(){ //location archives
		if( $(this).val() === 'modal' ){
			$('tbody.em-search-form-advanced-hidden').hide().find('#dbem_search_form_advanced_trigger_yes').prop('checked', true);
		}else{
			$('tbody.em-search-form-advanced-hidden').show();
		}
	}).trigger('change');

	//For rewrite titles
	$('input:radio[name=dbem_disable_title_rewrites]').on('change',function(){
		checked_check = $('input:radio[name=dbem_disable_title_rewrites]:checked');
		if( checked_check.val() == 1 ){
			$('#dbem_title_html_row').show();
		}else{
			$('#dbem_title_html_row').hide();	
		}
	});
	$('input:radio[name=dbem_disable_title_rewrites]').trigger('change');
	//for event grouping
	$('select[name="dbem_event_list_groupby"]').on('change', function(){
		if( $('select[name="dbem_event_list_groupby"]').val() == 0 ){
			$('tr#dbem_event_list_groupby_header_format_row, tr#dbem_event_list_groupby_format_row').hide();
		}else{
			$('tr#dbem_event_list_groupby_header_format_row, tr#dbem_event_list_groupby_format_row').show();
		}
	}).trigger('change');

	//ML Stuff
	$('.em-translatable').on('click', function(){
		$(this).nextAll('.em-ml-options').toggle();
	});

	//radio triggers
	$('input[type="radio"].em-trigger').on('change', function(e){
		var el = $(this);
		el.val() == '1' ? $(el.attr('data-trigger')).show() : $(el.attr('data-trigger')).hide();
	});
	$('input[type="radio"].em-trigger:checked').trigger('change');
	$('input[type="radio"].em-untrigger').on('change', function(e){
		var el = $(this);
		el.val() == '0' ? $(el.attr('data-trigger')).show() : $(el.attr('data-trigger')).hide();
	});
	$('input[type="radio"].em-untrigger:checked').trigger('change');
	//checkbox triggers
	$('input[type="checkbox"].em-trigger').on('change', function(e){
		var el = $(this);
		el.prop('checked') ? $(el.attr('data-trigger')).show() : $(el.attr('data-trigger')).hide();
	});
	$('input[type="checkbox"].em-trigger').trigger('change');
	$('input[type="checkbox"].em-untrigger').on('change', function(e){
		var el = $(this);
		!el.prop('checked') ? $(el.attr('data-trigger')).show() : $(el.attr('data-trigger')).hide();
	});
	$('input[type="checkbox"].em-untrigger').trigger('change');
	//admin tools confirm
	$('a.admin-tools-db-cleanup').on('click', function( e ){
		if( !confirm(EM.admin_db_cleanup_warning) ){
			e.preventDefault();
			return false;
		}
	});
	// select triggers
	$('select.em-trigger').on('change', function(e){
		// hide all other option selectors
		let el = $(this)
		el.find('option:not(:selected)').each( function(){
			if( this.getAttribute('data-trigger') ){
				$( this.getAttribute('data-trigger') ).hide();
			}
		});
		if( this.selectedOptions.length > 0  && this.selectedOptions[0].getAttribute('data-trigger') ){
			$( this.selectedOptions[0].getAttribute('data-trigger') ).show();
		}
	}).trigger('change');

	// specific triggers
	// geolocation search form default distance options (main & advanced)
	$('input[name="dbem_search_form_geo"],input[name="dbem_search_form_geo_advanced"]').on( 'change', function(){
		let defaults = $('#dbem_search_form_geo_distance_default_row, #dbem_search_form_geo_unit_default_row');
		if ( document.getElementById('dbem_search_form_main_yes').checked && document.getElementById('dbem_search_form_geo_yes').checked ) {
			// just move the current default options to main setting, regardelss where they are
			$('#em-search-form-geo').append( defaults );
		} else {
			if ( document.getElementById('dbem_search_form_geo_advanced_yes').checked ){
				// move to advanced section and show
				$('#em-search-form-geo-advanced').append( defaults );
				$('#em-search-form-geo-advanced tr').show();
			}else{
				// hide all advanced options, because we have no geo searches here
				$('#em-search-form-geo-advanced tr:not(.em-subheader, #dbem_search_form_geo_advanced_row)').hide();
				// append to main, in case not already and hide
				$('#em-search-form-geo').append( defaults );
			}
		}
	}).filter(':checked').first().trigger('change');

	//color pickers
	$('#dbem_category_default_color, #dbem_tag_default_color').wpColorPicker();

	// reset admin setting via ajax
	$('.em-option-resettable').on('click', function( e ){
		e.preventDefault();
	    let el = $(this);
	    let name = el.attr('data-name');
	    let inputs = el.closest('tr').find('input[name="'+name+'"], textarea[name="'+name+'"]');
	    $.get({
	        url : EM.ajaxurl,
	        data : {
	            action : 'em_admin_get_option_default',
	            option_name : name,
	            nonce : el.attr('data-nonce'),
	        },
            success : function(data){
                inputs.val(data);
                inputs.prop('disabled', false);
                alert(EM.option_reset);
            },
            beforeSend: function(){
                inputs.prop('disabled', true);
            },
            error : function(){
                inputs.prop('disabled', false);
                alert('Error - could not revert.');
            },
	        dataType: 'text',
	    })
	});

    let status = $('#em-advanced-formatting');
    let af_toggle_action = function(){
        const am = status.val();
        if( am == 0 ){
            $('.am-af').hide();
        }else if( am == 1 ){
            $('.am-af').show();
            $('.dbem_advanced_formatting_modes_row').show(); // show toggles
            $('.dbem_advanced_formatting_modes .em-trigger:checked').trigger('change');
        }else{
            $('.am-af').show(); // show everything
            $('.dbem_advanced_formatting_modes_row').hide(); // hide toggles
        }
        $('.em-af-toggle, .em-af-status span').hide();
        $('.em-af-toggle.show-'+ am).show();
        $('.em-af-status-'+ am).show();
        if( $('.em-af-status').attr('data-status') != am ){
            $('.em-af-status .em-af-status-save').show();
        }else{
            $('.em-af-status .em-af-status-save').hide();
        }
    };
	$('.em-af-toggle').on('click', function(e){
	    e.preventDefault();
        status.val( this.getAttribute('data-set-status') );
        af_toggle_action();
	});
	af_toggle_action();

    if( typeof EM.admin === 'object' && 'settings' in EM.admin ){
        tippy( $('.dbem_advanced_formatting_modes_row th').toArray(), {
            content : EM.admin.settings.option_override_tooltip,
        });
    }

    // code editor for formats section
    if( 'codeEditor' in wp ){
        let codeEditorToggled = Cookies.get('em_codeEditor');
        let toggle = document.getElementById('em-enable-codeEditor');
        if( toggle ){
            toggle.checked = codeEditorToggled != 1;
            toggle.addEventListener('change', function(e){
                let checked = !e.target.checked ? 1:0;
                Cookies.set('em_codeEditor', checked);
            });
        }

        var editorSettings = wp.codeEditor.defaultSettings ? _.clone( wp.codeEditor.defaultSettings ) : {};
        editorSettings.codemirror = _.extend( {}, editorSettings.codemirror, {
                autofocus: true,
        });
        $('.em-menu-formats textarea').on('focus', function(){
            if( document.getElementById('em-enable-codeEditor').checked ){
                var editor = wp.codeEditor.initialize( this, editorSettings );
                editor.codemirror.on('blur', function( cm ){
                    cm.toTextArea();
                })
            }
        });
    }

	// MultiSite Stuff
	//events
	$('input[name="dbem_ms_global_events"]').on('change', function(){
		if( $('input:radio[name="dbem_ms_global_events"]:checked').val() == 1 ){
			$("tr#dbem_ms_global_events_links_row").show();
			$('input:radio[name="dbem_ms_global_events_links"]:checked').trigger('change');
		}else{
			$("tr#dbem_ms_global_events_links_row, tr#dbem_ms_events_slug_row").hide();
		}
	}).first().trigger('change');
	$('input[name="dbem_ms_global_events_links"]').on('change', function(){
		if( $('input:radio[name="dbem_ms_global_events_links"]:checked').val() == 1 ){
			$("tr#dbem_ms_events_slug_row").hide();
		}else{
			$("tr#dbem_ms_events_slug_row").show();
		}
	}).first().trigger('change');
	//locations
	$('input[name="dbem_ms_mainblog_locations"]').on('change', function(){
		if( $('input:radio[name="dbem_ms_mainblog_locations"]:checked').val() == 1 ){
			$("tbody.em-global-locations").hide();
		}else{
			$("tbody.em-global-locations").show();
		}
	}).first().trigger('change');
	$('input[name="dbem_ms_global_locations"]').on('change', function(){
		if( $('input:radio[name="dbem_ms_global_locations"]:checked').val() == 1 ){
			$("tr#dbem_ms_global_locations_links_row").show();
			$('input:radio[name="dbem_ms_global_locations_links"]:checked').trigger('change');
		}else{
			$("tr#dbem_ms_global_locations_links_row, tr#dbem_ms_locations_slug_row").hide();
		}
	}).first().trigger('change');
	$('input[name="dbem_ms_global_locations_links"]').on('change', function(){
		if( $('input:radio[name="dbem_ms_global_locations_links"]:checked').val() == 1 ){
			$("tr#dbem_ms_locations_slug_row").hide();
		}else{
			$("tr#dbem_ms_locations_slug_row").show();
		}
	});
	//MS Mode selection hiders
	$('input[name="dbem_ms_global_table"]').on('change', function(){ //global
		if( $('input:radio[name="dbem_ms_global_table"]:checked').val() == 1 ){
			$("tbody.em-global-options").show();
			$('input:radio[name="dbem_ms_mainblog_locations"]:checked').trigger('change');
		}else{
			$("tbody.em-global-options").hide();
		}
	}).first().trigger('change');
});

jQuery(document).on('em_javascript_loaded', function(){
	let settings = document.getElementById('em-phone-settings');
	let phoneContainer = document.getElementById('em-phone-example-container');
	let phone = document.getElementById('em-phone-example');
	let options = {};
	let selectItems = {
		'dbem_phone_default_country' : 'initialCountry',
		'dbem_phone_countries_include[]': 'onlyCountries',
		'dbem_phone_countries_exclude[]': 'excludeCountries'
	};
	const reset = function(){
		let iti = EM.intlTelInput.getInstance(phone);
		if( iti ) iti.destroy();
		// rebuild arrays so they have fresh values not referenced
		for ( const [key, opt] of Object.entries(selectItems) ) {
			let value = settings.querySelector('select[name="' + key + '"]').selectize.getValue();
			options[opt] = JSON.parse(JSON.stringify(value));
		}
		em_setup_phone_inputs( phoneContainer, options );
	}
	for ( const [key, opt] of Object.entries(selectItems) ) {
		settings.querySelector('select[name="' + key + '"]').selectize.on('change', reset);
	}
	let boolItems = {
		'dbem_phone_national_format' : 'nationalMode',
		'dbem_phone_show_selected_code' : 'separateDialCode',
		'dbem_phone_show_flags' : 'showFlags',
		'dbem_phone_detect' : 'detectJS',
	};
	for ( const [key, opt] of Object.entries(boolItems) ) {
		settings.querySelectorAll('[name="' + key + '"]').forEach((el) => {
			el.addEventListener('click', (e) => {
				options[opt] = e.target.value === '1';
				reset();
			})
		});
	}
});

/*! js-cookie v3.0.1 | MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,o=e.Cookies=t();o.noConflict=function(){return e.Cookies=n,o}}())}(this,(function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}return function t(n,o){function r(t,r,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n.write(r,t)+c}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},r=0;r<t.length;r++){var i=t[r].split("="),c=i.slice(1).join("=");try{var u=decodeURIComponent(i[0]);if(o[u]=n.read(c,u),e===u)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){r(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})}));
jQuery(document).ready( function($){
	$('.bct-options').hide();
	//Booking Form
	$('form.em-form-custom').each( function( i, form ){
		let myform = $(form);
		let booking_template = myform.find('#booking-custom-item-template').detach();
		myform.on('click', '.booking-form-custom-field-remove', function(e){
			e.preventDefault();
			$(this).parents('.booking-custom-item').remove();
			reserve_selected_userfields();
		});
		myform.find('.booking-form-custom-field-add').on('click', function(e){
			e.preventDefault();
			booking_template.find('select.selectized').each( function(){
				this.selectize.destroy();
			} );
			let booking_template_clone = booking_template.clone();
			booking_template_clone.appendTo($(this).parents('.em-form-custom').find('ul.booking-custom-body').first());
			em_setup_selectize(booking_template_clone);
		});
		myform.on('click', '.booking-form-custom-field-options', function(e){
			$(this).blur();
			e.preventDefault();
			if( $(this).attr('rel') != '1' ){
				$(this).parents('.em-form-custom').find('.booking-form-custom-field-options').attr('rel','0')
				$(this).parents('.booking-custom-item').find('select.booking-form-custom-type').trigger('change');
			}else{
				$(this).parents('.booking-custom-item').find('.bct-options, .bct-options-toggle').slideUp();
				$(this).attr('rel','0');
			}
		});
		myform.on('click', '.bct-options-toggle', function(e){
			e.preventDefault();
			$(this).blur().parents('.booking-custom-item').find('.booking-form-custom-field-options').trigger('click');
		});
		//specifics
		myform.on('change', '.booking-form-custom-label', function(e){
			let parent_div =  $(this).parents('.booking-custom-item').first();
			let field_id = parent_div.find('input.booking-form-custom-fieldid').first();
			if( field_id.val() == '' ){
				let field_id_name = escape($(this).val()).replace(/%[0-9]+/g,'_').toLowerCase();
				field_id_name = field_id_name.replace('_-_', '_');
				if( field_id_name.length > 50 ){
					field_id_name = field_id_name.substring(0, 50);
				}
				field_id.val(field_id_name);
			}
		});
		myform.on('change', 'input[type="checkbox"]', function(){
			let checkbox = $(this);
			if( checkbox.next().attr('type') == 'hidden' ){
				if( checkbox.is(':checked') ){
					checkbox.next().val(1);
				}else{
					checkbox.next().val(0);
				}
			}
		});
		let reserve_selected_userfields = function(){
			myform.find('.booking-form-custom-type optgroup.bc-custom-user-fields option:disabled, .booking-form-custom-type optgroup.bc-core-user-fields option:disabled').prop('disabled', false);
			myform.find('.booking-form-custom-type optgroup.bc-custom-user-fields option:selected, .booking-form-custom-type optgroup.bc-core-user-fields option:selected').each( function( i, el ){
				let item = $(el);
				let item_val = item.val();
				let filter = '.booking-form-custom-type optgroup.bc-custom-user-fields option[value="'+item_val+'"], .booking-form-custom-type optgroup.bc-core-user-fields option[value="'+item_val+'"]';
				let found_items = myform.find(filter).add(booking_template.find(filter));
				found_items.each( function(i_2, taken_item){
					taken_item = $(taken_item);
					if( !taken_item.is(item) ){
						taken_item.prop('disabled', true);
					}
				});
			});
		};
		reserve_selected_userfields();
		myform.on('change', '.booking-form-custom-type', function(){
			$('.bct-options').slideUp();
			$('.bct-options-toggle').hide();
			let reg_keys = []; //get reg keys from booking template for use in type_keys
			booking_template.find('.bc-custom-user-fields option, .bc-core-user-fields option').each( function( i, field ){
				reg_keys.push(field.value);
			});
			let type_keys = {
				select : ['select','multiselect'],
				country : ['country'],
				date : ['date'],
				time : ['time'],
				html : ['html'],
				selection : ['checkboxes','radio'],
				checkbox : ['checkbox'],
				text : ['text','textarea','email'],
				tel : ['tel'],
				registration : reg_keys,
				captcha : ['captcha']
			}
			let select_box = $(this);
			let selected_value = select_box.val();
			$.each(type_keys, function(option,types){
				if( $.inArray(selected_value,types) > -1 ){
					//get parent div
					let parent_div =  select_box.parents('.booking-custom-item').first();
					//slide the right divs in/out
					parent_div.find('.bct-'+option).slideDown();
					parent_div.find('.bct-options-toggle').show();
					parent_div.find('.booking-form-custom-field-options').attr('rel','1');
				}
			});
			reserve_selected_userfields();
		});
		myform.on('click', '.bc-link-up, .bc-link-down', function(e){
			e.preventDefault();
			let item = $(this).parents('.booking-custom-item').first();
			if( $(this).hasClass('bc-link-up') ){
				if(item.prev().length > 0){
					item.prev().before(item);
				}
			}else{
				if( item.next().length > 0 ){
					item.next().after(item);
				}
			}
		});
		myform.on('mousedown', '.bc-col-sort', function(){
			parent_div =  $(this).parents('.booking-custom-item').first();
			parent_div.find('.bct-options').hide();
			parent_div.find('.booking-form-custom-field-options').attr('rel','0');
		});
		myform.find('.booking-custom-body').sortable({
			placeholder: "bc-highlight",
			handle:'.bc-col-sort'
		});
		//Fix for PHP max_ini_vars
		if ( EM.max_input_vars > 0 && typeof JSON.stringify != 'undefined' ){
			$('.em-form-custom').submit( function(event){
			    let myform = $(this);
				//count input vars
			    if ($('form#em_fields_json').length){
					return; //have already made switch, so let default submit take place
			    }
				if( myform.serializeArray().length < EM.max_input_vars ){
					return true;
				}
			    event.preventDefault();
				let data = myform.serializeJSON();
				//create new form and add data to it
				let new_form  = $('<form id="em_fields_json" action="" method="post"></form>').append($('<input type="hidden" />').attr({id:'em_fields_json', name:'em_fields_json', value:data}));
				myform.after(new_form);
				new_form.submit();
			});
		}
		//ML Stuff
		myform.find('.bc-translatable').on('click', function(){
			$(this).closest('li.booking-custom-item').find('.' + $(this).attr('rel')).slideToggle();
		});
	});
});
/** Added for PHP max_ini_let issues, see further up.
 * jQuery serializeObject
 * @copyright 2014, macek <paulmacek@gmail.com>
 * @link https://github.com/macek/jquery-serialize-object
 * @license BSD
 * @version 2.5.0
 */
!function(e,i){if("function"==typeof define&&define.amd)define(["exports","jquery"],function(e,r){return i(e,r)});else if("undefined"!=typeof exports){let r=require("jquery");i(exports,r)}else i(e,e.jQuery||e.Zepto||e.ender||e.$)}(this,function(e,i){function r(e,r){function n(e,i,r){return e[i]=r,e}function a(e,i){for(let r,a=e.match(t.key);void 0!==(r=a.pop());)if(t.push.test(r)){let u=s(e.replace(/\[\]$/,""));i=n([],u,i)}else t.fixed.test(r)?i=n([],r,i):t.named.test(r)&&(i=n({},r,i));return i}function s(e){return void 0===h[e]&&(h[e]=0),h[e]++}function u(e){switch(i('[name="'+e.name+'"]',r).attr("type")){case"checkbox":return"on"===e.value?!0:e.value;default:return e.value}}function f(i){if(!t.validate.test(i.name))return this;let r=a(i.name,u(i));return l=e.extend(!0,l,r),this}function d(i){if(!e.isArray(i))throw new Error("formSerializer.addPairs expects an Array");for(let r=0,t=i.length;t>r;r++)this.addPair(i[r]);return this}function o(){return l}function c(){return JSON.stringify(o())}let l={},h={};this.addPair=f,this.addPairs=d,this.serialize=o,this.serializeJSON=c}let t={validate:/^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,key:/[a-z0-9_]+|(?=\[\])/gi,push:/^$/,fixed:/^\d+$/,named:/^[a-z0-9_]+$/i};return r.patterns=t,r.serializeObject=function(){return new r(i,this).addPairs(this.serializeArray()).serialize()},r.serializeJSON=function(){return new r(i,this).addPairs(this.serializeArray()).serializeJSON()},"undefined"!=typeof i.fn&&(i.fn.serializeObject=r.serializeObject,i.fn.serializeJSON=r.serializeJSON),e.FormSerializer=r,r});
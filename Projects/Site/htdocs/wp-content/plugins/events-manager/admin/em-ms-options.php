<?php
function em_ms_upgrade( $blog_id ){
	?>
	<div class="wrap">		
		<div id='icon-options-general' class='icon32'><br /></div>
		<h2><?php esc_html_e('Update Network','events-manager'); ?></h2>
		<?php
		$site_updates = EM_Options::site_get('updates');
		if( !empty($_REQUEST['action']) && $_REQUEST['action'] == 'upgrade_network' && check_admin_referer('em_ms_upgrade') ){
			global $current_site,$wpdb;
			$blog_ids = $wpdb->get_col('SELECT blog_id FROM '.$wpdb->blogs.' WHERE site_id='.$current_site->id);
			echo '<ul>';
			foreach($blog_ids as $blog_id){
			    $plugin_basename = plugin_basename(dirname(dirname(__FILE__)).'/events-manager.php');
			    if( in_array( $plugin_basename, (array) get_blog_option($blog_id, 'active_plugins', array() ) ) || is_plugin_active_for_network($plugin_basename) ){
					if( EM_VERSION > get_blog_option($blog_id, 'dbem_version', 0) ){
						switch_to_blog($blog_id);
						require_once( dirname(__FILE__).'/../em-install.php');
						em_install();
						echo "<li>".sprintf(_x('Updated %s.', 'Multisite Blog Update','events-manager'), get_bloginfo('blogname'))."</li>";
						restore_current_blog();
					}else{
						echo "<li>".sprintf(_x('%s is up to date.', 'Multisite Blog Update','events-manager'), get_blog_option($blog_id, 'blogname'))."</li>";
					}
			    }else{
			    	echo "<li>".sprintf(_x('%s does not have Events Manager activated.', 'Multisite Blog Update','events-manager'), get_blog_option($blog_id, 'blogname'))."</li>";
				}
			}
			echo '</ul>';
			echo "<p>".esc_html__('Update process has finished.', 'events-manager')."</p>";
		}elseif( !empty($_REQUEST['action']) && !empty($site_updates[$_REQUEST['action']]) ){
			do_action('em_admin_update_ms_'.$_REQUEST['action']);
		}else{
			?>
			<form action="" method="post">
				<p><?php esc_html_e('To update your network blogs with the latest Events Manager automatically, click the update button below.','events-manager'); ?></p>
				<input type="hidden" name="_wpnonce" value="<?php echo wp_create_nonce('em_ms_upgrade'); ?>" />
				<input type="hidden" name="action" value="upgrade_network" />
				<input type="submit" value="<?php esc_attr_e('Update Network','events-manager'); ?>" class="button-primary" />
			</form>
			<?php
			//extra upgrade stuff
			foreach( $site_updates as $update => $update_data ){
				do_action('em_admin_update_ms_settings_'.$update, $update_data);
			}
		}
		?>
	</div>
	<?php
}

/**
 * Displays network-related options in the network admin section
 * @uses em_options_save() to save settings 
 */
function em_ms_admin_options_page() {
	global $wpdb,$EM_Notices;
	//Check for uninstall/reset request
	if( !empty($_REQUEST['action']) && $_REQUEST['action'] == 'uninstall' ){
		em_admin_options_uninstall_page();
		return;
	}	
	if( !empty($_REQUEST['action']) && $_REQUEST['action'] == 'reset' ){
		em_admin_options_reset_page();
		return;
	}
	//TODO place all options into an array
	$tabs_enabled = defined('EM_SETTINGS_TABS') && EM_SETTINGS_TABS;
	$events_placeholders = '<a href="'.EM_ADMIN_URL .'&amp;events-manager-help#event-placeholders">'. __('Event Related Placeholders','events-manager') .'</a>';
	$locations_placeholders = '<a href="'.EM_ADMIN_URL .'&amp;events-manager-help#location-placeholders">'. __('Location Related Placeholders','events-manager') .'</a>';
	$bookings_placeholders = '<a href="'.EM_ADMIN_URL .'&amp;events-manager-help#booking-placeholders">'. __('Booking Related Placeholders','events-manager') .'</a>';
	$categories_placeholders = '<a href="'.EM_ADMIN_URL .'&amp;events-manager-help#category-placeholders">'. __('Category Related Placeholders','events-manager') .'</a>';
	$events_placeholder_tip = " ". sprintf(__('This accepts %s and %s placeholders.','events-manager'),$events_placeholders, $locations_placeholders);
	$locations_placeholder_tip = " ". sprintf(__('This accepts %s placeholders.','events-manager'), $locations_placeholders);
	$categories_placeholder_tip = " ". sprintf(__('This accepts %s placeholders.','events-manager'), $categories_placeholders);
	$bookings_placeholder_tip = " ". sprintf(__('This accepts %s, %s and %s placeholders.','events-manager'), $bookings_placeholders, $events_placeholders, $locations_placeholders);
	
	global $save_button;
	$save_button = '<tr><th>&nbsp;</th><td><p class="submit" style="margin:0px; padding:0px; text-align:right;"><input type="submit" class="button-primary" name="Submit" value="'. __( 'Save Changes', 'events-manager') .' ('. __('All','events-manager') .')" /></p></td></tr>';
	//Do some multisite checking here for reuse
	?>
	<style type="text/css">.postbox h3 { cursor:pointer; }</style>
	<div class="wrap <?php if(empty($tabs_enabled)) echo 'tabs-active' ?>">
		<div id='icon-options-general' class='icon32'><br /></div>
		<h1 id="em-options-title"><?php _e ( 'Event Manager Options', 'events-manager'); ?></h1>
		<h2 class="nav-tab-wrapper">
			<?php
			if( $tabs_enabled ){
				$general_tab_link = esc_url(add_query_arg( array('em_tab'=>'general')));
			}else{
				$general_tab_link = '';
			}
			?>
			<a href="<?php echo $general_tab_link ?>#general" id="em-menu-general" class="nav-tab nav-tab-active"><?php esc_html_e('General','events-manager'); ?></a>
			<?php
			$custom_tabs = apply_filters('em_ms_options_page_tabs', array());
			foreach( $custom_tabs as $tab_key => $tab_name ){
				$tab_link = !empty($tabs_enabled) ? esc_url(add_query_arg( array('em_tab'=>$tab_key))) : '';
				$active_class = !empty($tabs_enabled) && !empty($_GET['em_tab']) && $_GET['em_tab'] == $tab_key ? 'nav-tab-active':'';
				echo "<a href='$tab_link#$tab_key' id='em-menu-$tab_key' class='nav-tab $active_class'>$tab_name</a>";
			}
			?>
		</h2>
		<?php echo $EM_Notices; ?>
		<form id="em-options-form" method="post" action="">
			<div class="metabox-holder">         
			<!-- // TODO Move style in css -->
			<div class='postbox-container' style='width: 99.5%'>
			<div id="">
			<?php if( !$tabs_enabled || ($tabs_enabled && (empty($_REQUEST['em_tab']) || $_REQUEST['em_tab'] == 'general')) ): //make less changes for now, since we don't have any core tabs to add yet ?>
		  	<div class="em-menu-general em-menu-group">
				<div  class="postbox " id="em-opt-ms-options" >
					<div class="handlediv" title="<?php __('Click to toggle', 'events-manager'); ?>"><br /></div><h3><span><?php _e ( 'Multi Site Options', 'events-manager'); ?></span></h3>
					<div class="inside">
			            <table class="form-table">
							<?php 
							em_options_radio_binary ( __( 'Enable global tables mode?', 'events-manager'), 'dbem_ms_global_table', __( 'Setting this to yes will make all events save in the main site event tables (EM must also be activated). This allows you to share events across different blogs, such as showing events in your network whilst allowing users to display and manage their events within their own blog. Bear in mind that activating this will mean old events created on the sub-blogs will not be accessible anymore, and if you switch back they will be but new events created during global events mode will only remain on the main site.','events-manager') );
							?>
							<tbody class="em-global-options">
							<?php
							global $current_site;
							$global_slug_tip = __('%s belonging to other sub-sites will have an extra slug prepended to it so that your main site can differentiate between its own %s and those belonging to other sites in your network.','events-manager');
							$global_link_tip = __( 'When displaying global %s on the main site you have the option of users viewing the %s details on the main site or being directed to the sub-site.','events-manager');
							$global_post_tip = __( 'Displays %s from all sites on the network by default. You can still restrict %s by blog using shortcodes and template tags coupled with the <code>blog</code> attribute. Requires global tables to be turned on.','events-manager');
							$global_link_tip2 = __('You <strong>must</strong> have assigned a %s page in your <a href="%s">main blog settings</a> for this to work.','events-manager');
							$options_page_link = get_admin_url($current_site->blog_id, 'edit.php?post_type='.EM_POST_TYPE_EVENT.'&page=events-manager-options#pages');
							?><tr class="em-header"><td><h4><?php echo sprintf(__('%s Options','events-manager'),__('Event','events-manager')); ?></h4></td></tr><?php
							em_options_radio_binary ( sprintf(__( 'Display global events on main blog?', 'events-manager'), __('events','events-manager')), 'dbem_ms_global_events', sprintf($global_post_tip, __('events','events-manager'), __('events','events-manager')) );
							em_options_radio_binary ( sprintf(__( 'Link sub-site %s directly to sub-site?', 'events-manager'), __('events','events-manager')), 'dbem_ms_global_events_links', sprintf($global_link_tip, __('events','events-manager'), __('event','events-manager')).sprintf($global_link_tip2, __('event','events-manager'), $options_page_link) );
							em_options_input_text ( sprintf(__( 'Global %s slug', 'events-manager'),__('event','events-manager')), 'dbem_ms_events_slug', sprintf($global_slug_tip, __('Events','events-manager'), __('events','events-manager')).__('Example:','events-manager').'<code>http://yoursite.com/events/<strong>event</strong>/subsite-event-slug/', EM_EVENT_SLUG );
							?><tr class="em-header"><td><h4><?php echo sprintf(__('%s Options','events-manager'),__('Location','events-manager')); ?></h4></td></tr><?php
							em_options_radio_binary ( sprintf(__( 'Locations on main blog?', 'events-manager'), __('locations','events-manager')), 'dbem_ms_mainblog_locations', __('If you would prefer all your locations to belong to your main blog, users in sub-sites will still be able to create locations, but the actual locations are created and reside in the main blog.','events-manager') );
							?>
							</tbody>
							<tbody class="em-global-options em-global-locations">
							<?php
							em_options_radio_binary ( sprintf(__( 'Display global %s on main blog?', 'events-manager'), __('locations','events-manager')), 'dbem_ms_global_locations', sprintf($global_post_tip, __('locations','events-manager'), __('locations','events-manager')) );
							em_options_radio_binary ( sprintf(__( 'Link sub-site %s directly to sub-site?', 'events-manager'), __('locations','events-manager')), 'dbem_ms_global_locations_links', sprintf($global_link_tip, __('locations','events-manager'), __('location','events-manager')).sprintf($global_link_tip2, __('location','events-manager'), $options_page_link) );
							em_options_input_text ( sprintf(__( 'Global %s slug', 'events-manager'),__('location','events-manager')), 'dbem_ms_locations_slug', sprintf($global_slug_tip, __('Locations','events-manager'), __('locations','events-manager')).__('Example:','events-manager').'<code>http://yoursite.com/locations/<strong>location</strong>/subsite-location-slug/', EM_LOCATION_SLUG );
							?>
							</tbody>
							<?php echo $save_button; ?>
						</table>
						    
					</div> <!-- . inside --> 
				</div> <!-- .postbox --> 
				
				<?php 
				//including shared MS/non-MS boxes
				em_admin_option_box_caps();
				em_admin_option_box_image_sizes();
				em_admin_option_box_email();
				em_admin_option_box_uninstall();
				?>
				
				<?php do_action('em_ms_options_page_footer'); ?>
			</div> <!-- .em-menu-general -->
			<?php endif; ?>
			<?php
			//other tabs
			if( $tabs_enabled ){
				if( array_key_exists($_REQUEST['em_tab'], $custom_tabs) ){
					?>
					<div class="em-menu-bookings em-menu-group">
						<?php do_action('em_ms_options_page_tab_'. $_REQUEST['em_tab']); ?>
					</div>
					<?php
				}
			}else{
				foreach( $custom_tabs as $tab_key => $tab_name ){
					?>
					<div class="em-menu-<?php echo esc_attr($tab_key) ?> em-menu-group" style="display:none;">
						<?php do_action('em_ms_options_page_tab_'. $tab_key); ?>
					</div>
					<?php
				}
			}
			?>

			<p class="submit">
				<input type="submit" class="button-primary" name="Submit" value="<?php esc_attr_e( 'Save Changes', 'events-manager'); ?>" />
				<input type="hidden" name="em-submitted" value="1" />
				<input type="hidden" name="_wpnonce" value="<?php echo wp_create_nonce('events-manager-options'); ?>" />
			</p>  
			
			</div> <!-- .metabox-sortables -->
			</div> <!-- .postbox-container -->
			
			</div> <!-- .metabox-holder -->	
		</form>
	</div>
	<?php
}
?>
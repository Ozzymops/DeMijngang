<?php
class EMP_Logs{
	/**
	 * Creates a log entry in plugins/events-manager-logs/$log_name-yyyy-mm-dd-logs.txt
	 * @param string|array|object $log_text
	 * @param string $log_name
	 */
	public static function log( $log_text, $log_name ){
	    $log_directory = self::get_log_directory();
	    if( $log_directory ){
	    	$log_directory = apply_filters('em_logs_log_directory', $log_directory, $log_text, $log_name );
	    	$log_name = apply_filters('em_logs_log_name', $log_name, $log_text);
		    $file = @fopen( $log_directory.$log_name.'-'.date('Y-m-d').'.txt' ,'a+');
		    if( $file ){
		        if( is_array($log_text) || is_object($log_text) ){
		            ob_start();
		            if( is_array($log_text) && key($log_text) === 0 ){
		            	echo current($log_text) . "\n";
		            	array_shift($log_text);
		            }
		            @var_export($log_text);
		            $log_text = ob_get_clean();
		        }
		        fwrite($file, "\n".' ---- ['.date('Y-m-d H:i:s').'] ---------------------'."\n");
				fwrite($file, $log_text);
				fclose($file);
				return true;
		    }
	    }
	    return false;
	}
	
	public static function get_log_directory(){
	    $log_directory = WP_PLUGIN_DIR.'/events-manager-logs/';
	    if( !is_dir($log_directory) ){
	        //try to make a directory and create an .htaccess file
	    	if( @mkdir($log_directory, 0755) ){
	    	    $file = @fopen($log_directory.'.htaccess','w');
			    if( $file ){
					fwrite($file, 'deny from all');
					fclose($file);
					return $log_directory;
			    }
	    	}
	    }elseif( file_exists($log_directory.'.htaccess') ){
	        return $log_directory;
	    }
	    return false;
	}
}
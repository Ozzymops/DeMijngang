<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
?>

<?php get_template_part( 'templates/sidebar-templates/sidebar', 'footerfull' ); ?>

<div class="wrapper" id="wrapper-footer">
	<div class="footer-container">
		<div class="footer-copyright">
			<i class="far fa-copyright"></i>
			<p>De MijnGang</p>
		</div>
		<div class="footer-socials">
			<a href="mailto:demijngang@outlook.com"><i class="fas fa-at"></i></a>
			<a href="https://www.facebook.com/demijngang/"><i class="fab fa-facebook"></i></a>
			<a href="https://web.whatsapp.com/send?phone=458514900"><i class="fab fa-whatsapp"></i></a>
		</div>
		<div class="footer-policies">
			<a href="https://demijngang.nl/privacy/privacyverklaring">Privacyverklaring</a>
			<a href="https://demijngang.nl/privacy/algemene-voorwaarden">Voorwaarden</a>
		</div>
	</div>
</div><!-- #wrapper-footer -->

<?php // Closing div#page from header.php. ?>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>

</html>

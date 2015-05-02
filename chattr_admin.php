<?php
defined( 'ABSPATH' ) or die();

if($_POST['chattr_hidden'] == '1') {
	$posted_options = [];
	foreach (["chatname", "server", "port"] as $key)
	{
		$posted_options[$key] = $_POST['chattr_' . $key];
	}
	update_option('chattr_options', serialize($posted_options));
        ?><div class="updated"><p><strong><?php _e('Options saved.' ); ?></strong></p></div><?php
}

$chattr_options = unserialize(get_option('chattr_options'));

?>

<div class="wrap">
    <?php    echo "<h2>" . __( 'Chattr Options', 'chattr_trdom' ) . "</h2>"; ?>
    <form name="chattr_form" method="post" action="<?php echo str_replace( '%7E', '~', $_SERVER['REQUEST_URI']); ?>">
        <input type="hidden" name="chattr_hidden" value="1">
        <?php    echo "<h4>" . __( 'Chattr Settings', 'chattr_trdom' ) . "</h4>"; ?>
        <p><?php _e("Chatroom Name: " ); ?><input type="text" name="chattr_chatname" value="<?php echo $chattr_options['chatname']; ?>" size="20"><?php _e(" ex: myChatRoom" ); ?></p>
        <p><?php _e("Chat Server: " ); ?><input type="text" name="chattr_server" value="<?php echo $chattr_options['server']; ?>" size="20"><?php _e(" ex: example.dev" ); ?></p>
        <p><?php _e("Chat Port: " ); ?><input type="text" name="chattr_port" value="<?php echo $chattr_options['port']; ?>" size="20"><?php _e(" ex: 8080" ); ?></p>
        <hr />
        <p class="submit">
        <input type="submit" name="Submit" value="<?php _e('Update Options', 'chattr_trdom' ) ?>" />
        </p>
    </form>
</div>

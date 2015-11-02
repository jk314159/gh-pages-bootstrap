function Heart() {

	/*
		The play field is 320 x 120, or 20 hearts wide by 7.5 hearts tall.

		The position of a heart represents the center of the heart.
	*/

	this.sprite = null;

	this.board_x = 320;
	this.board_y = 120;

	this.pos_x = 160;
	this.pos_y = 112;

	this.vel_y = 0; // vel_x is never affected.

	this.size_x = 16;
	this.size_y = 16;

	this.movement_velocity = 180; /* 120 pixels per second */
	this.gravity = 360; /* 120 pixels per second squared; subject to change */

	this.jump_height = 120;
	this.max_jump_height = 80;

	this.h_move_state = "none";
	this.v_move_state = "none";

	this.update = function(delta) {

		/* resolve moving. */
		if (this.h_move_state == "left") {
			this.pos_x = Math.max(0 + this.size_y / 2, this.pos_x - this.movement_velocity * delta);
		} else if (this.h_move_state == "right") {
			this.pos_x = Math.min(320 - this.size_y / 2, this.pos_x + this.movement_velocity * delta);
		}

		if (this.v_move_state == "falling") {

			var new_vel_y = Math.max(this.vel_y - this.gravity * delta, -this.movement_velocity);
			var dy = ((this.vel_y + new_vel_y) / 2) * delta; // trapezoid integration

			this.vel_y = new_vel_y;

			this.pos_y -= dy;
			if (this.pos_y > this.board_y - this.size_y / 2) {
				this.pos_y = this.board_y - this.size_y / 2;
				this.v_move_state = "none";
				if (keyboard.pressed("up")) {
					this.v_move_state = "jumping";
				}
				this.jump_height = this.max_jump_height;
			}

			if (this.pos_y < this.size_y / 2) {
				// this can still happen.
				this.pos_y = this.size_y / 2;
				this.vel_y = 0;
			}

		} else if (this.v_move_state == "jumping") {

			this.vel_y = this.movement_velocity;
			var dy = this.vel_y * delta;

			if (this.jump_height < dy) {
				this.pos_y -= this.jump_height;
				dy -= this.jump_height;
				this.jump_height = 0;
				this.v_move_state = "falling";
				// correct the dy trapezoid
				dy -= (this.gravity) * Math.pow(dy / this.gravity, 2) / 2;
				this.vel_y = this.movement_velocity;
				this.pos_y -= dy;
			} else {
				this.pos_y -= dy;
				this.jump_height -= dy;
			}

			if (this.pos_y < this.size_y / 2) {
				this.pos_y = this.size_y / 2;
				this.v_move_state = "falling";
				this.vel_y = 0;
			}

		}

		if (this.sprite) {
			this.sprite.position.set(Math.round(this.pos_x), Math.round(this.pos_y), 2);
		}

	};

}

Heart.prototype.move = function(dir) {
	switch (dir) {
		case "left":
			this.h_move_state = "left";
			break;
		case "right":
			this.h_move_state = "right";
			break;
		case "clear_h":
			this.h_move_state = "none";
			if (keyboard.pressed("left")) {
				this.h_move_state = "left";
			} else if (keyboard.pressed("right")) {
				this.h_move_state = "right";
			}
			break;
		case "up":
			if (this.v_move_state != "falling"){
				this.v_move_state = "jumping";
			}
			break;
		case "clear_v":
			this.vel_y = Math.min(this.vel_y, 0);
			this.v_move_state = "falling";
			break;
	}
}

var heart = new Heart();

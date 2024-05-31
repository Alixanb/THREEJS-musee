import * as THREE from 'three'

// Based on examples/jsm/controls/FirstPersonControls
class MyFirstPersonControls {
	constructor(camera, domElement) {

		this.camera = camera;
		this.target = new THREE.Vector3(0, 0, 0);

		this.domElement = (domElement !== undefined) ? domElement : document;

		this.enabled = true;
		this.enableCollisions = false;

		// Hauteur du regard de l'observateur
		this.lookHeight = 1.5;
		this.setLookHeight = function (lookHeight) {
			this.lookHeight = lookHeight;
		};

		// Données pour la gestion des déplacements
		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;

		this.moveSpeed = 2.0;
		this.setMoveSpeed = function (moveSpeed) {
			this.moveSpeed = moveSpeed;
		};

		// Données pour la gestion de la direction du regard
		this.mouseX = 0;
		this.mouseY = 0;

		this.prevMouseX = 0;
		this.prevMouseY = 0;

		this.moveX = 0;
		this.moveY = 0;

		this.mouseDown = false;

		this.lat = 0;
		this.phi = THREE.MathUtils.degToRad(90 - this.lat);
		var viewDir = new THREE.Vector2(this.camera.position.x, this.camera.position.z);
		viewDir.multiplyScalar(-1);
		viewDir.normalize();
		this.theta = Math.acos(viewDir.dot(new THREE.Vector2(0, -1)));
		if (this.camera.position.x > 0)
			this.theta *= -1;
		this.lon = THREE.MathUtils.radToDeg(this.theta);

		this.onMouseDown = function (event) {
			if (event.button == 0) {
				this.mouseDown = true;
				this.mouseX = event.clientX;
				this.mouseY = event.clientY;
			}
		};

		this.onMouseUp = function (event) {
			if (event.button == 0)
				this.mouseDown = false;
		};

		this.onMouseMove = function (event) {
			if (this.mouseDown) {
				this.prevMouseX = this.mouseX;
				this.prevMouseY = this.mouseY;

				this.mouseX = event.clientX;
				this.mouseY = event.clientY;

				// Calcul de la direction du regard
				this.lon += (this.mouseX - this.prevMouseX) * 0.2;
				this.lat -= (this.mouseY - this.prevMouseY) * 0.1;
				this.lat = Math.max(-85, Math.min(85, this.lat));
				this.phi = THREE.MathUtils.degToRad(90 - this.lat);
				this.theta = THREE.MathUtils.degToRad(this.lon);
			}
		};

		this.onKeyDown = function (event) {
			switch (event.code) {
				case "KeyW":
				case "ArrowUp":
					// Forward
					this.moveForward = true;
					break;
				case "KeyA":
				case "ArrowLeft":
					// Left
					this.moveLeft = true;
					break;
				case "KeyS":
				case "ArrowDown":
					// Down
					this.moveBackward = true;
					break;
				case "KeyD":
				case "ArrowRight":
					// Right
					this.moveRight = true;
					break;
			}

		};

		this.onKeyUp = function (event) {
			switch (event.code) {
				case "KeyW":
				case "ArrowUp":
					// Forward
					this.moveForward = false;
					break;
				case "KeyA":
				case "ArrowLeft":
					// Left
					this.moveLeft = false;
					break;
				case "KeyS":
				case "ArrowDown":
					// Down
					this.moveBackward = false;
					break;
				case "KeyD":
				case "ArrowRight":
					// Right
					this.moveRight = false;
					break;
			}
		};

		this.update = function (delta) {
			// Le paramètre delta représente le temps écoulé
			// depuis la dernière frame affichée

			if (this.enabled === false)
				return;

			// Déplacement
			if (this.moveForward)
				this.camera.translateZ(-this.moveSpeed * delta);

			if (this.moveBackward)
				this.camera.translateZ(this.moveSpeed * delta);

			if (this.moveLeft)
				this.camera.translateX(-this.moveSpeed * delta);

			if (this.moveRight)
				this.camera.translateX(this.moveSpeed * delta);

			var targetPosition = this.target;
			var position = this.camera.position;

			// Calcul de la position et de l'orientation de la caméra en tenant compte
			// de la position et de la direction du regard
			targetPosition.x = position.x + 10 * Math.sin(this.phi) * Math.sin(this.theta);
			targetPosition.y = position.y + 10 * Math.cos(this.phi);
			targetPosition.z = position.z - 10 * Math.sin(this.phi) * Math.cos(this.theta);

			this.camera.lookAt(targetPosition);
			this.camera.position.y = this.lookHeight;
		};

		this.dispose = function () {
			this.domElement.addEventListener('mousedown', _onMouseDown, false);
			this.domElement.addEventListener('mouseup', _onMouseUp, false);
			this.domElement.removeEventListener('mousemove', _onMouseMove, false);
			window.removeEventListener('keydown', _onKeyDown, false);
			window.removeEventListener('keyup', _onKeyUp, false);
		};

		var _onMouseMove = bind(this, this.onMouseMove);
		var _onMouseDown = bind(this, this.onMouseDown);
		var _onMouseUp = bind(this, this.onMouseUp);
		var _onKeyDown = bind(this, this.onKeyDown);
		var _onKeyUp = bind(this, this.onKeyUp);

		this.domElement.addEventListener('mousedown', _onMouseDown, false);
		this.domElement.addEventListener('mouseup', _onMouseUp, false);
		this.domElement.addEventListener('mousemove', _onMouseMove, false);
		window.addEventListener('keydown', _onKeyDown, false);
		window.addEventListener('keyup', _onKeyUp, false);

		function bind(scope, fn) {
			return function () {
				fn.apply(scope, arguments);
			};
		}
	}
}

export { MyFirstPersonControls };

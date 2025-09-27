extends CollisionShape2D

# Enemy movement variables
@export var speed = 100  # Movement speed
@export var direction = -1  # Movement direction (-1 left, 1 right)

# Reference to the parent CharacterBody2D
@onready var parent = get_parent()

func _ready() -> void:
	# Ensure the parent is a CharacterBody2D
	if not parent is CharacterBody2D:
		print("Warning: Enemy script should be on a child of CharacterBody2D")

func _process(delta: float) -> void:
	# If the parent is a CharacterBody2D, update its velocity
	if parent is CharacterBody2D:
		# Set horizontal movement
		parent.velocity.x = speed * direction
		
		# Check for wall collision to change direction
		if parent.is_on_wall():
			direction *= -1  # Reverse direction
		
		# Optional: Flip sprite based on direction
		if parent.has_node("AnimatedSprite2D"):
			var sprite = parent.get_node("AnimatedSprite2D")
			sprite.flip_h = direction < 0

# Optional: Add a method to handle enemy taking damage
func take_damage():
	queue_free()  # Simple death method

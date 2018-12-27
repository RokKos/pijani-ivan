using UnityEngine;

public class CharacterController : MonoBehaviour
{
    [Header("Moving")]
    [SerializeField] Rigidbody rigidbody;
    [SerializeField] float speed;
    [SerializeField] float maxMovingVelocity;


    [Header("Rotation")]
    [SerializeField] float sensitivity;
    private const string mouseX = "Mouse X";


    [Header("Shooting")]
    [SerializeField] BulletPoolController bulletPoolController;

    // Start is called before the first frame update
    void Start()
    {
        Cursor.lockState = CursorLockMode.Locked;
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetMouseButtonDown(0)) {
            Shoot();
        }

        MovePlayer();
        RotatePlayer();

    }

    private void MovePlayer() {
        Vector3 velocity = rigidbody.velocity;
        float accelaration = speed * Time.fixedDeltaTime;

        // --- Moving Forward / Backward ---
        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow)) {
            MoveIntoDirection(velocity, accelaration, transform.forward.normalized);
        }

        if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow)) {
            MoveIntoDirection(velocity, -accelaration, transform.forward.normalized);
        }


        // --- Moving Left / Right ---
        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow)) {
            MoveIntoDirection(velocity, -accelaration, transform.right.normalized);
        }

        if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.LeftArrow)) {
            MoveIntoDirection(velocity, accelaration, transform.right.normalized);
        }
    }

    private void RotatePlayer() {
        Vector3 eulerAngles = transform.eulerAngles;
        eulerAngles.y += sensitivity * Input.GetAxis(mouseX);
        transform.eulerAngles = eulerAngles;
    }

    private void MoveIntoDirection(Vector3 velocity, float accelaration, Vector3 forward) {
        float velocityZ = Mathf.Min(velocity.z + accelaration * forward.z, maxMovingVelocity);
        float velocityX = Mathf.Min(velocity.x + accelaration * forward.x, maxMovingVelocity);
        velocity.z = velocityZ;
        velocity.x = velocityX;
        rigidbody.velocity = velocity;
    }

    private void Shoot() {
        BulletController bullet = bulletPoolController.GetBullet();
        bullet.transform.position = transform.position + transform.forward + Vector3.up;
        
        bullet.SetDirectionOfMoving(transform.rotation);
    }
}

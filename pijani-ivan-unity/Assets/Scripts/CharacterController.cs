using UnityEngine;
using UnityEngine.UI;

public class CharacterController : MonoBehaviour
{
    [Header("Moving")]
    [SerializeField] Rigidbody rigidbody;
    [SerializeField] float speed;
    [SerializeField] float maxMovingVelocity;
    [SerializeField] Transform resetTransform;

    [Header("Jogging")]
    [SerializeField] float jogFactor;
    [SerializeField] float jogSinusKvocient;
    [SerializeField] float jogSinusOffset;
    [SerializeField] AudioSource footstepAudio;

    private float joggingAngle = 0;

    [Header("Rotation")]
    [SerializeField] Camera mainCamera;
    [SerializeField] Transform gunTransform;
    [Tooltip("Sensitivity for player rotation on X axis")]
    [SerializeField] float sensitivityX;

    [Tooltip("Sensitivity for camera rotation on Y axis")]
    [SerializeField] float sensitivityY;

    private const string mouseX = "Mouse X";
    private const string mouseY = "Mouse Y";


    [Header("Shooting")]
    [SerializeField] BulletPoolController bulletPoolController;
    [SerializeField] AudioSource gunshootAudio;
    [SerializeField] AudioSource gunEmptyAudio;
    [SerializeField] AudioSource gunReloadAudio;
    [SerializeField] AudioSource bottleThrowAudio;
    [SerializeField] Animator lightAnimator;
    [SerializeField] Transform bulletSpawnPoint;
    const string kTagAmmonition = "Ammonition";
    const string kTagFinish = "Finish";


    [Header("Player Stats")]
    [Range(1, 25)]
    [SerializeField] int playerLives;

    [Range(0.5f, 5)]
    [SerializeField] float timeBetweenHits;

    [Range(1, 500)]
    [SerializeField] int numBullet;

    [Range(1, 10)]
    [SerializeField] int numMolotovs;

    [Header("UI")]
    [SerializeField] Animator UiAnimator;
    [SerializeField] Text txtBullets;
    //[SerializeField] Text txtMolotovs;
    


    private const string kBearTag = "Bear";
    private const string kPlayerHurt = "PlayerHurt";
    private float timeFromLastHit;


    // Start is called before the first frame update
    void Start()
    {
        Cursor.lockState = CursorLockMode.Locked;
        timeFromLastHit = timeBetweenHits;
 
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetMouseButtonDown(0)) {
            Shoot();
        }
        if (Input.GetKeyDown(KeyCode.F) || Input.GetMouseButtonDown(1)) {
            ThrowMolotov();
        }

        MovePlayer();
        RotatePlayer();
        RotateCamera();
        RotateGun();

        timeFromLastHit += Time.deltaTime;

    }

    private void MovePlayer() {
        Vector3 velocity = rigidbody.velocity;
        float accelaration = speed * Time.fixedDeltaTime;

        Vector3 moveDirection = new Vector3();

        // --- Moving Forward / Backward ---
        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow)) {
            moveDirection += transform.forward;
        }

        if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow)) {
            moveDirection -= transform.forward;
        }


        // --- Moving Left / Right ---
        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow)) {
            moveDirection -= transform.right;
        }

        if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.LeftArrow)) {
            moveDirection += transform.right;
        }

        if (moveDirection.sqrMagnitude > 0)
        {
            moveDirection.Normalize();
            MoveIntoDirection(velocity, accelaration, moveDirection);
        }
    }

    private void RotatePlayer() {
        Vector3 eulerAngles = transform.eulerAngles;
        eulerAngles.y += sensitivityX * Input.GetAxis(mouseX);
        transform.eulerAngles = eulerAngles;
    }

    private void RotateCamera() {
        Vector3 eulerAngles = mainCamera.transform.eulerAngles;
        eulerAngles.x += sensitivityY * Input.GetAxis(mouseY);
        mainCamera.transform.eulerAngles = eulerAngles;
    }

    private void RotateGun() {
        Vector3 eulerAngles = gunTransform.eulerAngles;
        eulerAngles.z -= sensitivityY * Input.GetAxis(mouseY);
        gunTransform.eulerAngles = eulerAngles;
    }

    private void MoveIntoDirection(Vector3 velocity, float accelaration, Vector3 forward) {
        //float velocityZ = Mathf.Min(velocity.z + accelaration * forward.z, maxMovingVelocity);
        //float velocityX = Mathf.Min(velocity.x + accelaration * forward.x, maxMovingVelocity);
        //velocity.z = velocityZ;
        //velocity.x = velocityX;
        rigidbody.velocity = speed * forward;

        FakeJogging();
    }

    private void FakeJogging() {
        joggingAngle += Time.deltaTime * jogFactor;
        float sinus = Mathf.Sin(Mathf.Deg2Rad * joggingAngle);

        if (Mathf.Abs(sinus - 1) < 0.01 && !footstepAudio.isPlaying) {
            Debug.Log(sinus);
            footstepAudio.Play();
        }

        float yPos = sinus / jogSinusKvocient + jogSinusOffset;
        Vector3 camPos = mainCamera.transform.position;
        camPos.y = yPos;
        mainCamera.transform.position = camPos;
    }

    private void Shoot() {
        if (numBullet > 0) {
            numBullet--;
            txtBullets.text = numBullet.ToString();
            BulletController bullet = bulletPoolController.GetBullet();
            //bullet.transform.position = transform.position + transform.forward * 2 + Vector3.up + transform.right / 2;
            bullet.transform.position = bulletSpawnPoint.position;

            bullet.SetDirectionOfMoving(transform.rotation, mainCamera.transform.rotation);
            gunshootAudio.Play();
            lightAnimator.SetTrigger("Flash");
        } else {
            if (!gunEmptyAudio.isPlaying) {
                gunEmptyAudio.Play();
            }
        }
    }

    private void ThrowMolotov() {
        if (numMolotovs > 0) {
            numMolotovs--;
            //txtMolotovs.text = numMolotovs.ToString();
            MolotovController molotov = bulletPoolController.GetMolotov();
            molotov.transform.position = transform.position + transform.forward * 2 + Vector3.up + transform.right / 2;
            molotov.SetDirectionOfMoving(transform.rotation, mainCamera.transform.rotation);
            bottleThrowAudio.Play();
        }
    }

    private void OnCollisionEnter(Collision collision) {
        CollisionWithBear(collision);
    }

    private void OnCollisionStay(Collision collision) {
        CollisionWithBear(collision);
    }

    private void CollisionWithBear(Collision collision) {
        bool isHit = collision.collider.tag == kBearTag && timeFromLastHit > timeBetweenHits;

        if (isHit) {
            playerLives--;
            HealthBar.health -= 10f;
            UiAnimator.SetTrigger(kPlayerHurt);
            timeFromLastHit = 0;
            if (playerLives <= 0) {
                //TODO: End game
                //Time.timeScale = 0;
            }
        }
    }

    private void OnTriggerEnter(Collider other) {
        
        if (other.tag == kTagAmmonition) {
            numBullet += 30;
            txtBullets.text = numBullet.ToString();
            gunReloadAudio.Play();
        }

        if (other.tag == kTagFinish)
        {
            GameController.Instance.EndLevel();
        }
    }

    public void ResetPlayer()
    {
        transform.position = resetTransform.position;
        transform.rotation = resetTransform.rotation;
    }
}

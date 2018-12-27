﻿using UnityEngine;

public class CharacterController : MonoBehaviour
{
    [Header("Moving")]
    [SerializeField] Rigidbody rigidbody;
    [SerializeField] float speed;
    [SerializeField] float maxMovingVelocity;


    [Header("Rotation")]
    [SerializeField] Camera mainCamera;
    [SerializeField] float sensitivity;
    private const string mouseX = "Mouse X";
    private const string mouseY = "Mouse Y";


    [Header("Shooting")]
    [SerializeField] BulletPoolController bulletPoolController;

    [Header("Player Stats")]
    [Range(1, 25)]
    [SerializeField] int playerLives;

    [Range(0.5f, 5)]
    [SerializeField] float timeBetweenHits;

    [Range(1, 500)]
    [SerializeField] int numBullet;

    [SerializeField] Animator UiAnimator;


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

        MovePlayer();
        RotatePlayer();

        timeFromLastHit += Time.deltaTime;

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
        bullet.transform.position = transform.position + transform.forward * 2 + Vector3.up + transform.right / 2;
        


        bullet.SetDirectionOfMoving(transform.rotation, mainCamera.transform.rotation);
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
            UiAnimator.SetTrigger(kPlayerHurt);
            timeFromLastHit = 0;
            if (playerLives <= 0) {
                //TODO: End game
                //Time.timeScale = 0;
            }
        }
    }
}

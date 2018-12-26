using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CharacterController : MonoBehaviour
{
    [Header("Moving")]
    [SerializeField] Rigidbody rigidbody;
    [SerializeField] float speed;
    [SerializeField] float maxMovingVelocity;


    [Header("Shooting")]
    [SerializeField] BulletPoolController bulletPoolController;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetMouseButtonDown(0)) {
            BulletController bullet = bulletPoolController.GetBullet();
            bullet.SetDirectionOfMoving(Vector3.one);
        }

        MovePlayer();

    }

    private void MovePlayer() {
        Vector3 velocity = rigidbody.velocity;
        float accelaration = speed * Time.fixedDeltaTime;

        // --- Moving Forward / Backward ---
        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow)) {
            float velocityZ = Mathf.Min(velocity.z + accelaration, maxMovingVelocity);
            velocity.z = velocityZ;
            rigidbody.velocity = velocity;
        }

        if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow)) {
            float velocityZ = Mathf.Max(velocity.z - accelaration, -maxMovingVelocity);
            velocity.z = velocityZ;
            rigidbody.velocity = velocity;
        }


        // --- Moving Left / Right ---
        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow)) {
            float velocityX = Mathf.Min(velocity.x + accelaration, maxMovingVelocity);
            velocity.x = velocityX;
            rigidbody.velocity = velocity;
        }

        if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.LeftArrow)) {
            float velocityX = Mathf.Max(velocity.x - accelaration, -maxMovingVelocity);
            velocity.x = velocityX;
            rigidbody.velocity = velocity;
        }
    }
}

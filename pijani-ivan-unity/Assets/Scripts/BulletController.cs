using UnityEngine;

public class BulletController : PoolObjectController
{
    [SerializeField] ParticleSystem particleSystem;

    MeshRenderer meshRenderer;
    private const string kBearTag = "Bear";

    private void Start() {
        meshRenderer = GetComponent<MeshRenderer>();
    }

    public override void Destroy() {
        base.Destroy();
        bulletPoolController.ReturnBullet(this);
    }

    public override void ResetRigitBody() {
        base.ResetRigitBody();
        transform.rotation = Quaternion.Euler(0, 0, 90);
        rigidbody.rotation = transform.rotation;
    }

    public void SetDirectionOfMoving(Quaternion playerRotation, Quaternion cameraRotation) {
        Vector3 bulletDirection = CalculateDirection(playerRotation, cameraRotation);
        rigidbody.velocity = bulletDirection * speed;

        Quaternion orientationOfBullet = Quaternion.Euler(0, 90 + playerRotation.eulerAngles.y, 90 + cameraRotation.eulerAngles.x);
        transform.rotation = orientationOfBullet;
    }

    private void OnCollisionEnter(Collision collision) {
        // Disable physics
        Destroy(rigidbody);

        if(collision.collider.gameObject.tag == kBearTag) {
            meshRenderer.enabled = false;
            particleSystem.Play();
            Destroy(gameObject, 1.0f);
        }
        else {
            Destroy(gameObject);
        }

    }

}

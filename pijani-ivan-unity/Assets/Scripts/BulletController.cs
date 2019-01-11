using UnityEngine;

public class BulletController : PoolObjectController
{
    [SerializeField] ParticleSystem particleSystem;

    MeshRenderer meshRenderer;
    private const string kBearTag = "Bear";

    private void Start() {

    }


    public void Init()
    {
        meshRenderer = GetComponent<MeshRenderer>();
    }

    public override void Destroy() {
        base.Destroy();
        bulletPoolController.ReturnBullet(this);
    }

    public override void ResetRigitBody() {
        base.ResetRigitBody();
        meshRenderer.enabled = true;
        rigidbody.isKinematic = false;
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

        if(collision.collider.gameObject.tag == kBearTag) {
            rigidbody.isKinematic = true;
            meshRenderer.enabled = false;
            particleSystem.Play();
            // TODO: return to pool
            Invoke("Destroy", 1.0f);
        }
        else {
            Destroy();
        }

    }

}

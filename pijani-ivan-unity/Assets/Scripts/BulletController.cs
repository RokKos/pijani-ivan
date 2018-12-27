using UnityEngine;

public class BulletController : MonoBehaviour
{
    [SerializeField] Rigidbody rigidbody;
    [SerializeField] float speed;

    private BulletPoolController bulletPoolController;

    public void SetBulletPoolController(BulletPoolController _bulletPoolController) {
        bulletPoolController = _bulletPoolController;
    }

    public void Destroy() {
        bulletPoolController.ReturnBullet(this);
    }

    public void ResetBulletRigitBody() {
        rigidbody.velocity = Vector3.zero;
        rigidbody.angularVelocity = Vector3.zero;
        transform.rotation = Quaternion.Euler(0, 0, 90);
        rigidbody.rotation = transform.rotation;
    }

    public void SetDirectionOfMoving(Quaternion rotation) {
        

        float direction = Mathf.Deg2Rad * rotation.eulerAngles.y;
        Vector3 bulletDirection = new Vector3(Mathf.Sin(direction), 0, Mathf.Cos(direction));
        rigidbody.velocity = bulletDirection * speed;

        Quaternion orientationOfBullet = Quaternion.Euler(0, 90 + rotation.eulerAngles.y, 90);
        transform.rotation = orientationOfBullet;
    }

    private void OnCollisionEnter(Collision collision) {
        rigidbody.velocity = Vector3.zero;
        Destroy();
    }

}

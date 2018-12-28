using UnityEngine;

public class BulletController : PoolObjectController
{
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
        rigidbody.velocity = Vector3.zero;
        Destroy();
    }

}

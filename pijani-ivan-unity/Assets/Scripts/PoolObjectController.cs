using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PoolObjectController : MonoBehaviour
{
    [SerializeField] protected Rigidbody rigidbody;
    [SerializeField] protected float speed;

    protected BulletPoolController bulletPoolController;

    public void SetPoolController(BulletPoolController _bulletPoolController) {
        bulletPoolController = _bulletPoolController;
    }

    public virtual void Destroy() {
        Debug.Log("Return to pool: " + name);
    }

    public virtual void ResetRigitBody() {
        rigidbody.velocity = Vector3.zero;
        rigidbody.angularVelocity = Vector3.zero;
        transform.rotation = Quaternion.Euler(0, 0, 0);
        rigidbody.rotation = transform.rotation;
    }

    protected Vector3 CalculateDirection(Quaternion playerRotation, Quaternion cameraRotation) {
        float directionX = Mathf.Deg2Rad * playerRotation.eulerAngles.y;
        float directionY = Mathf.Deg2Rad * cameraRotation.eulerAngles.x;
        Vector3 direction = new Vector3(Mathf.Sin(directionX), -Mathf.Sin(directionY), Mathf.Cos(directionX));
        return direction;
    }
}

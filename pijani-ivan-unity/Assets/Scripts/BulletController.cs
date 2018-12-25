using System.Collections;
using System.Collections.Generic;
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

    public void SetDirectionOfMoving(Vector3 direction) {
        rigidbody.velocity = direction * speed;
    }

    private void OnCollisionEnter(Collision collision) {
        rigidbody.velocity = Vector3.zero;
        Destroy();
    }
}

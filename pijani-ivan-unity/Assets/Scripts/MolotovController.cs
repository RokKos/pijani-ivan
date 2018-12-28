using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MolotovController : PoolObjectController
{

    private void Start() {
        Invoke("Destroy", 5);
    }

    public override void Destroy() {
        base.Destroy();
        bulletPoolController.ReturnMolotov(this);
    }

    public Rigidbody GetRigitBody() {
        return rigidbody;
    }


    public void SetDirectionOfMoving(Quaternion playerRotation, Quaternion cameraRotation) {
        Vector3 molotovDirection = CalculateDirection(playerRotation, cameraRotation);
        rigidbody.AddForce(molotovDirection * speed, ForceMode.Impulse);
        rigidbody.AddTorque(molotovDirection * speed, ForceMode.Impulse);
    }

}

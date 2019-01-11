using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MolotovController : PoolObjectController
{
    [SerializeField] AudioSource bottleFallAudio;
    [SerializeField] float timeUntilDestroy;
    private bool soundPlayed = false;

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
        soundPlayed = false;
        Invoke("Destroy", timeUntilDestroy);
    }

    private void OnCollisionEnter(Collision collision)
    {
        if (!soundPlayed)
        {
            bottleFallAudio.Play();
            soundPlayed = true;
        }
    }
}

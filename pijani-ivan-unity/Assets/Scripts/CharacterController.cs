using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CharacterController : MonoBehaviour
{
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
    }
}

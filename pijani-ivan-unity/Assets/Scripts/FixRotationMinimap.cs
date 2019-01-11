using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FixRotationMinimap : MonoBehaviour
{
    Transform minimapCamera;

    // Start is called before the first frame update
    void Start()
    {
        minimapCamera = GameController.Instance.minimapCamera;
    }

    // Update is called once per frame
    void Update()
    {

        if (minimapCamera == null) {
            minimapCamera = GameController.Instance.minimapCamera;
        }

        Vector3 rotation = transform.eulerAngles;
        rotation.y = minimapCamera.eulerAngles.y;
        rotation.z = minimapCamera.eulerAngles.z;
        this.transform.eulerAngles = rotation;
    }
}

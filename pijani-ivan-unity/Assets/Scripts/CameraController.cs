using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    [SerializeField] Transform characterTransform;
    [SerializeField] Vector3 Offset;

    // Update is called once per frame
    void Update(){
        Vector3 pos = characterTransform.position;
        pos -= Offset;
        transform.position = pos;

        transform.rotation = characterTransform.rotation;
        
    }
}

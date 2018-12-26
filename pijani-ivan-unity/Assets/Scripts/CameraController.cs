using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    [SerializeField] float sensitivityY;
    private const string mouseY = "Mouse Y";

    // Update is called once per frame
    void Update(){
        Vector3 eulerAngles = transform.eulerAngles;
        eulerAngles.x += sensitivityY * Input.GetAxis(mouseY);
        transform.eulerAngles = eulerAngles;
    }
}

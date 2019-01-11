using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KeyController : MonoBehaviour {

    private const string kPlayerTag = "Player";

    [SerializeField] Animator door;


    private void OnTriggerEnter(Collider other) {
        if (other.tag == kPlayerTag) {
            door.SetBool("Open", true);
            GameController.Instance.DisplayKeyText();
            Destroy(this.gameObject);
        }
    }
}

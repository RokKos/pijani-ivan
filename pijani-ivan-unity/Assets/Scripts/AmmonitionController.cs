using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AmmonitionController : MonoBehaviour
{
    const string kTagPlayer = "Player";

    private void OnTriggerEnter(Collider other) {
        if (other.tag == kTagPlayer) {
            Destroy(this.gameObject);
        }
    }
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KeyController : MonoBehaviour {

    private const string kPlayerTag = "Player";

    private LevelController levelController;

    public void SetLevelController(LevelController _levelController) {
        levelController = _levelController;
    }

    private void OnTriggerEnter(Collider other) {
        if (other.tag == kPlayerTag) {
            levelController.OpenGates(this);
            Destroy(this.gameObject);
        }
    }
}

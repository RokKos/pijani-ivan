using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UiController : MonoBehaviour
{
    [SerializeField] Animator openGatesAnimator;


    private const string kOpenGateTrigger = "OpenGate";
    // Start is called before the first frame update
    void Start()
    {
        
    }

    public void DisplayOpenGates() {
        openGatesAnimator.SetTrigger(kOpenGateTrigger);
    }
}
